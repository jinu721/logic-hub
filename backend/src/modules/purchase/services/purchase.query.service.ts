import { HttpStatus } from "@constants"
import {
  PublicPurchaseDTO,
  toPublicPurchaseDTO,
  toPublicPurchaseDTOs,
  IPurchaseRepository,
  IPurchaseQueryService
} from "@modules/purchase"
import { PurchaseDocument } from "@shared/types"
import { AppError } from "@utils/application"
import { BaseService } from "@core"


export class PurchaseQueryService
  extends BaseService<PurchaseDocument, PublicPurchaseDTO> implements IPurchaseQueryService
{
  constructor(private readonly purchaseRepo: IPurchaseRepository) {
    super()
  }

  protected toDTO(purchase: PurchaseDocument): PublicPurchaseDTO {
    return toPublicPurchaseDTO(purchase)
  }

  protected toDTOs(purchases: PurchaseDocument[]): PublicPurchaseDTO[] {
    return toPublicPurchaseDTOs(purchases)
  }

  async getUserPurchases(userId: string) {
    const purchases = await this.purchaseRepo.getUserPlanPurchases(userId)
    return this.mapMany(purchases)
  }

  async getPlanHistoryById(id: string) {
    const purchase = await this.purchaseRepo.getPlanHistoryById(id)
    if (!purchase) {
      throw new AppError(HttpStatus.NOT_FOUND, "Purchase not found")
    }
    return this.mapOne(purchase)
  }

  async getPlanHistory(page: number, limit: number) {
    const skip = (page - 1) * limit

    const purchases = await this.purchaseRepo.getPlanHistory(skip, limit)
    const totalItems = await this.purchaseRepo.countPlanHistory()

    return {
      items: this.mapMany(purchases),
      totalItems
    }
  }
}
