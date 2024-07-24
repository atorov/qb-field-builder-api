import compression from "compression";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import type { AddressInfo } from "net";

const apiPort = process.env.API_PORT || 3000;

class HttpError extends Error {
    constructor(
        public message: string,
        public code: number,
    ) {
        super(message);
    }
}

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());

app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-With, Content-Type, Accept, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE",
    );
    next();
});

app.get("/api/health", (_req, res) => {
    res.json({
        message: "Server is up and running...",
    });
});

app.use(() => {
    throw new HttpError("::: Error! Could not find this route!", 404);
});

app.use(
    (
        error: Error | HttpError,
        _req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        console.error(error);

        if (res.headersSent) {
            return next(error);
        }

        if (error instanceof HttpError) {
            res.status(error.code);
        } else {
            res.status(500);
        }

        return res.json({
            message: error.message || "::: Error! An unknown error ocurred!",
        });
    },
);

const a = app.listen(apiPort, () => {
    const addressInfo = <AddressInfo>a.address();
    console.log(
        `::: Server listening at http://${addressInfo.address}:${addressInfo.port}`,
    );
});
