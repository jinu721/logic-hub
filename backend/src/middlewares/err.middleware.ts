import { Request, Response, NextFunction } from "express";
import logger from "../utils/application/logger";
import { AppError } from "../utils/application/app.error"; 

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`${req.method} ${req.url} - ${statusCode} - ${message}`, {
    stack: err.stack,
    details: err.details || null,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err.details,
    }),
  });
}
