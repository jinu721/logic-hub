import { Response } from "express";

export const sendSuccess = (
  res: Response,
  status: number,
  result: any,
  message?: string
) => {
  return res.status(status).json({
    success: true,
    message,
    result,
  });
};

export const sendError = (
  res: Response,
  status: number,
  error: unknown,
  result?: any
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