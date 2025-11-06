import { PurchaseIF } from "../../shared/types/purchase.types"



export interface IPurchaseRepository {
    createPlanPurchase(data:PurchaseIF):Promise<PurchaseIF>
    getUserPlanPurchases(userId:string):Promise<PurchaseIF[] | null>
    getPlanHistoryById(id:string):Promise<PurchaseIF | null>
    getPlanHistory(skip:number,limit:number):Promise<PurchaseIF[] | null>
    countPlanHistory():Promise<number>
}