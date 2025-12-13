import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  status: number,
  result: T,
  message?: string
) => {
  return res.status(status).json({
    success: true,
    message,
    result,
  });
};

export const sendError = <T>(
  res: Response,
  status: number,
  error: unknown,
  result?: T
) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Something went wrong";

  return res.status(status).json({
    success: false,
    message,
    result,
  });
};
