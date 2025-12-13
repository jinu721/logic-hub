import { Query } from "mongoose";

export function toLean<T>(query: Query<unknown, unknown>): Promise<T | null> {
  return query.lean<T>().exec();
}

export function toLeanMany<T>(query: Query<unknown, unknown>): Promise<T[]> {
  return query.lean<T>().exec() as Promise<T[]>;
}

export function populateAndLean<T>(
  query: Query<unknown, unknown>,
  populateFn: (q: Query<unknown, unknown>) => Query<unknown, unknown>
): Promise<T | null> {
  return populateFn(query).lean<T>().exec();
}

export function populateAndLeanMany<T>(
  query: Query<unknown, unknown>,
  populateFn: (q: Query<unknown, unknown>) => Query<unknown, unknown>
): Promise<T[]> {
  return populateFn(query).lean<T>().exec() as Promise<T[]>;
}
