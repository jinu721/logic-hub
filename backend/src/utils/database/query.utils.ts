import { Query } from "mongoose";

export function toLean<T>(query: Query<any, any>): Promise<T | null> {
  return query.lean<T>().exec();
}

export function toLeanMany<T>(query: Query<any, any>): Promise<T[]> {
  return query.lean<T>().exec() as Promise<T[]>;
}

export function populateAndLean<T>(
  query: Query<any, any>,
  populateFn: (q: Query<any, any>) => Query<any, any>
): Promise<T | null> {
  return populateFn(query).lean<T>().exec();
}

export function populateAndLeanMany<T>(
  query: Query<any, any>,
  populateFn: (q: Query<any, any>) => Query<any, any>
): Promise<T[]> {
  return populateFn(query).lean<T>().exec() as Promise<T[]>;
}
