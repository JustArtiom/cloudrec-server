import { httpMethods } from "~/types";
import { Router } from "express";
import path from "path";
import fs from "node:fs";

export function registerRoutes() {
    const app = Router();
    const routes = routeFilesToObject();
    for (let route of routes) {
        (app as any)[route.method!](
            route.route,
            ...route.preHandlers,
            route.handler
        );
    }

    return app;
}

function routeFilesToObject(reqDir = "./dist/routes") {
    reqDir = path.join(reqDir);
    const endpoints: {
        route: string;
        method: string;
        preHandlers: (() => any)[];
        handler: () => any;
    }[] = [];

    function traverseDirectory(dir: string) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (let file of files) {
            if (file.isDirectory()) {
                traverseDirectory(path.join(file.path, file.name));
                continue;
            }

            const fileroute = path.join(file.path, file.name);
            file.name = file.name.split(".").slice(0, -1).join("."); // Slice the file extension
            const method = file.name.split(".").pop();
            const endpoint = file.name.split(".").slice(0, -1).join(".") || "/";
            const route = path
                .join(file.path, endpoint)
                .replace(reqDir, "")
                .replace(/\\/g, "/")
                .replace(/\[([^\[\]]+)\]/g, ":$1");

            if (
                !method ||
                !httpMethods.map((x) => x.toLocaleLowerCase()).includes(method)
            )
                continue;

            const module = require(path.join("../", fileroute));
            if (!module?.handler) continue;

            endpoints.push({
                route: route,
                method: method,
                preHandlers: module?.preHandlers || [],
                handler: module.handler,
            });
        }
    }

    traverseDirectory(reqDir);
    return endpoints;
}
