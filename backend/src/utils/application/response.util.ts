import { Response } from "express";

export const sendSuccess = (
  res: Response,
  status: number,
  data: any,
  message?: string
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  status: number,
  error: unknown,
  data?: any
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
    data,
  });
};