import { PurchaseDocument } from "@shared/types";



export interface IPurchaseRepository {
    createPlanPurchase(data:PurchaseDocument):Promise<PurchaseDocument>
    getUserPlanPurchases(userId:string):Promise<PurchaseDocument[] | null>
    getPlanHistoryById(id:string):Promise<PurchaseDocument | null>
    getPlanHistory(skip:number,limit:number):Promise<PurchaseDocument[] | null>
    countPlanHistory():Promise<number>
}