import { Document, Model, FilterQuery, UpdateQuery, Types } from "mongoose";

export abstract class BaseRepository<T extends Document> {
    constructor(protected model: Model<T>) {}

    async findById(id:string): Promise<T | null> {
        return this.model.findById(id);
    }

    async findAll(): Promise<T[]> {
        return this.model.find();
    }

    async create(data: Partial<T>): Promise<T> {
        return new this.model(data).save();
    }

    async update(id: Types.ObjectId, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: Types.ObjectId): Promise<T | null> {
        return this.model.findByIdAndDelete(id);
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(filter);
    }

    async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }
}
