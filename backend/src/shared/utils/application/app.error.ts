export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isErrorDetailsObject(details: unknown): details is Record<string, unknown> {
  return typeof details === "object" && details !== null && !Array.isArray(details);
}
