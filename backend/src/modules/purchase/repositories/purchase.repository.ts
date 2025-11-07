import { PurchaseModel, IPurchaseRepository } from "@modules/purchase";
import { BaseRepository } from "@core";
import { PurchaseIF } from "@shared/types";



export class PurchaseRepository extends BaseRepository<PurchaseIF> implements IPurchaseRepository{
    constructor() {
        super(PurchaseModel)
    }
    async createPlanPurchase(data: PurchaseIF): Promise<PurchaseIF> {
        return await this.model.create(data);
    }
    async getUserPlanPurchases(userId: string): Promise<PurchaseIF[] | null> {
        return await this.model.find({userId}).populate("planId").populate("userId");
    }
    async getPlanHistoryById(id: string): Promise<PurchaseIF | null> {
        return await this.model.findById(id).populate("planId").populate("userId");
    }
    async getPlanHistory(skip: number, limit: number): Promise<PurchaseIF[] | null> {
        return this.model.find().skip(skip).limit(limit).sort({ createdAt: -1 }).populate("planId").populate("userId");
    }
    async countPlanHistory(): Promise<number> {
        return this.model.countDocuments();
    }
}