import { SortDirection, SortOrder } from "@shared/types";
import {
  Document,
  Model,
  FilterQuery,
  UpdateQuery,
  Types,
  HydratedDocument,
} from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id);
  }
  async findByIdLean(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).lean<T>();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }
  async findOneLean(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).lean<T>();
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }
  async findAllLean(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).lean<T[]>();
  }

  async create(data: Partial<T>): Promise<T> {
    return new this.model(data).save();
  }

  async insertMany(data: Partial<T>[]): Promise<HydratedDocument<T>[]> {
    return (await this.model.insertMany(data)) as HydratedDocument<T>[];
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    data: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<number> {
    const result = await this.model.updateMany(filter, update);
    return result.modifiedCount;
  }

  async findByIdAndDelete(id: Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async deleteOne(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter);
    return result.deletedCount > 0;
  }

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter);
    return result.deletedCount;
  }

  async countDocuments(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async paginate(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    sort: Record<string, SortDirection> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean<T[]>(),
      this.countDocuments(filter),
    ]);
    return { data, total };
  }
}
