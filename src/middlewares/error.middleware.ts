import { Request, Response, NextFunction } from "express";
import { CustomError } from "../types/custom-error";

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR LOG:", err);

  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  };

  if (err.code === '23505') {
    customError.message = "Duplicate field value entered (PostgreSQL)";
    customError.statusCode = 400;
  }

  if (err.code === '23503') {
    customError.message = "Foreign key constraint violation";
    customError.statusCode = 400;
  }

  if (err.code === '23502') {
    customError.message = "Missing required field (not-null constraint)";
    customError.statusCode = 400;
  }

  if (err.name === "ValidationError" && err.errors) {
    customError.message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.message = "Resource not found";
    customError.statusCode = 404;
  }

  res.status(customError.statusCode).json({
    success: false,
    error: customError.message,
  });
};

export default errorMiddleware;
