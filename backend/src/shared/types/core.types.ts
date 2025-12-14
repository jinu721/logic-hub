import { Request, Response } from "express";

export interface HttpContext {
    req?: Request;
    res?: Response;
    ip?: string;
    userAgent?: string;
}

export interface AuthContext {
    res?: Response;
}

export type AuthRequest = Request & {
    user?: {
        userId: string;
        email?: string;
        role?: string;
        [key: string]: unknown;
    };
};

export interface PaginationInput {
    page?: number;
    limit?: number;
}

export type SortOrder = "asc" | "desc";
export type SortDirection = 1 | -1;