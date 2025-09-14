import { PurchaseIF } from "../../types/purchase.types";
import { IPurchaseService } from "../interfaces/purchase.service.interface";
import { addMonths, addYears } from "date-fns";
import {
  PublicPurchaseDTO,
  toPublicPurchaseDTO,
  toPublicPurchaseDTOs,
} from "../../mappers/purchase.dto";
import { IPurchaseRepository } from "../../repository/interfaces/purchase.repository.interface";
import { IMembershipRepository } from "../../repository/interfaces/membership.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly _purchaseRepo: IPurchaseRepository,
    private readonly _membershipRepo: IMembershipRepository,
    private readonly _userRepo: IUserRepository
  ) {}

  async createPlanPurchase(
    data: Partial<PurchaseIF>
  ): Promise<PublicPurchaseDTO> {
    const now = new Date();

    if(!data.userId || !data.planId || !data.amount || !data.razorpayOrderId || !data.razorpayPaymentId || !data.razorpaySignature) {
      throw new Error("Missing required fields");
    }

    const plan = await this._membershipRepo.findById(String(data.planId));
    if (!plan) {
      throw new Error("Premium Plan not found");
    }

    let expiresAt: Date;
    if (plan.type === "silver") {
      expiresAt = addMonths(now, 1);
    } else if (plan.type === "gold") {
      expiresAt = addYears(now, 1);
    } else {
      throw new Error("Invalid plan type");
    }

    const fullPurchaseData: any = {
      ...data,
      startedAt: now,
      expiresAt,
    };

    const purchasedPlan = await this._purchaseRepo.createPlanPurchase(
      fullPurchaseData
    );

    await this._userRepo.update(data.userId, {
      membership: {
        planId: String(data.planId),
        startedAt: now,
        expiresAt,
        type: plan.type,
        isActive: true,
      },
    });

    return toPublicPurchaseDTO(purchasedPlan);
  }

  async getUserPurchases(userId: string): Promise<PublicPurchaseDTO[] | null> {
    const purchases = await this._purchaseRepo.getUserPlanPurchases(
      userId
    );
    return toPublicPurchaseDTOs(purchases as PurchaseIF[]);
  }

  async getPlanHistoryById(id: string): Promise<PublicPurchaseDTO | null> {
    const purchase = await this._purchaseRepo.getPlanHistoryById(id);
    return toPublicPurchaseDTO(purchase as PurchaseIF);
  }

  async getPlanHistory(page: number, limit: number): Promise<{purchases:PublicPurchaseDTO[],totalItems:number}> {
    const skip = (page - 1) * limit;
    const purchases = await this._purchaseRepo.getPlanHistory(skip,limit);
    const totalItems = await this._purchaseRepo.countPlanHistory();
    return {purchases:toPublicPurchaseDTOs(purchases as PurchaseIF[]),totalItems};
  }
}
