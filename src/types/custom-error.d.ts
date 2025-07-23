export interface CustomError extends Error {
    statusCode?: number;
    code?: number | string;
    errors?: {
        [key: string]: {
            message: string;
        };
    };
}
