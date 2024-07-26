import compression from "compression";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import type { AddressInfo } from "net";
import { z, type ZodError } from "zod";

const apiPort = process.env.PORT || 3000;

const DISPLAY_ORDER_VALUES = [
    "alphabetically_ascending",
    "alphabetically_descending",
    "predefined",
    "natural_number_ascending",
    "natural_number_descending",
] as const;

const Schema = z
    .object({
        choices: z
            .array(z.string())
            .min(1, { message: "Provide at least one choice." }),
        default: z.string(),
        displayOrder: z.enum(DISPLAY_ORDER_VALUES, {
            message: "Invalid display order selected.",
        }),
        label: z
            .string()
            .min(2, { message: "Label must be at least 2 characters long." })
            .min(1, { message: "Label cannot be empty." }),
        multiselect: z.boolean({
            message: "Multiselect must be a boolean value.",
        }),
        required: z.boolean({ message: "Required must be a boolean value." }),
    })
    .refine(
        (data) => {
            const uniqueValues = new Set([...data.choices, data.default]);
            return uniqueValues.size <= 5;
        },
        {
            message:
                "Choices and default must form a set of unique values with up to 5 elements.",
            path: ["choices", "default"],
        },
    );

type Data = z.infer<typeof Schema>;

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

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.get("/api/health", (_req, res) => {
    res.json({
        message: "Server is up and running...",
    });
});

app.post("/api/builder", (req, res, next) => {
    let data: Data = {} as Data;

    try {
        data = Schema.parse(req.body);
    } catch (error) {
        next(
            new HttpError(
                JSON.parse((error as ZodError).message)[0].message,
                422,
            ),
        );
    }

    const resData: Data = {
        ...data,
        choices: [
            ...new Set(
                [...data.choices, data.default]
                    .map((it) => it.trim().slice(0, 40))
                    .filter(Boolean),
            ),
        ],
        default: data.default.trim().slice(0, 40),
        label: data.label.trim().slice(0, 40),
    };

    res.json(resData);
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
