import { Request, Response, NextFunction } from "express";

export const httpMethods: string[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export interface APIHandlerOptions {
    req?: any;
    params?: Record<string, any>;
    body?: any;
    query?: Record<string, any>;
    res?: any;
}

export type APIhandler<T extends APIHandlerOptions = {}> = (
    req: T["req"] &
        Request<
            "params" extends keyof T ? T["params"] : any,
            any,
            "body" extends keyof T ? T["body"] : any,
            "query" extends keyof T ? T["query"] : any
        >,
    res: Response<"res" extends keyof T ? T["res"] : any>,
    next: NextFunction
) => any;
