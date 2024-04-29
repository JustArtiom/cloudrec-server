import { APIhandler } from "~/types";

export const handler: APIhandler = async (req, res, next) => {
    res.status(200).json({
        message: "Hello world",
    });
};
