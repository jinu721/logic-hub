import { Request, Response, NextFunction } from "express";
import logger from "../utils/application/logger";
import { AppError, isErrorDetailsObject } from "../utils/application/app.error";
import { env } from "@config/env";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal Server Error";

  const rawDetails = isAppError ? err.details : null;
  const safeDetails = isErrorDetailsObject(rawDetails) ? rawDetails : undefined;

  logger.error(`${req.method} ${req.url} - ${statusCode} - ${message}`, {
    stack: isAppError ? err.stack : undefined,
    details: safeDetails ?? null,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === "development" && {
      stack: isAppError ? err.stack : undefined,
      details: safeDetails,
    }),
  });
}
