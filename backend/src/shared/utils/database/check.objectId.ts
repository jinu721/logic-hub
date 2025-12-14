import { Types } from "mongoose";

export const isObjectId = (val: unknown): val is Types.ObjectId => val instanceof Types.ObjectId;