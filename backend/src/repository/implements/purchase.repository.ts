import {  MembershipPurchase } from "../../models/purchase.model";
import { BaseRepository } from "../base.repository";
import { IPurchaseRepository } from "../interfaces/purchase.repository.interface";
import { PurchaseIF } from "../../types/purchase.types";


export class PurchaseRepository extends BaseRepository<PurchaseIF> implements IPurchaseRepository{
    constructor() {
        super(MembershipPurchase)
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