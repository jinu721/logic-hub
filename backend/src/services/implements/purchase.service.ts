import { PurchaseIF } from "../../types/purchase.types";
import { MembershipRepository } from "../../repository/implements/membership.repository";
import { PurchaseRepository } from "../../repository/implements/purchase.repository";
import { IPurchaseService } from "../interfaces/purchase.service.interface";
import { addMonths, addYears } from "date-fns";
import { UserRepository } from "../../repository/implements/user.repository";
import {
  PublicPurchaseDTO,
  toPublicPurchaseDTO,
  toPublicPurchaseDTOs,
} from "../../mappers/purchase.dto";

export class PurchaseService implements IPurchaseService {
  constructor(
    private purchaseRepository: PurchaseRepository,
    private membershipRepository: MembershipRepository,
    private userRepository: UserRepository
  ) {}

  async createPlanPurchase(
    data: Partial<PurchaseIF>
  ): Promise<PublicPurchaseDTO> {
    const now = new Date();

    if(!data.userId || !data.planId || !data.amount || !data.razorpayOrderId || !data.razorpayPaymentId || !data.razorpaySignature) {
      throw new Error("Missing required fields");
    }

    const plan = await this.membershipRepository.findById(String(data.planId));
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

    const purchasedPlan = await this.purchaseRepository.createPlanPurchase(
      fullPurchaseData
    );

    await this.userRepository.update(data.userId, {
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
    const purchases = await this.purchaseRepository.getUserPlanPurchases(
      userId
    );
    return toPublicPurchaseDTOs(purchases as PurchaseIF[]);
  }

  async getPlanHistoryById(id: string): Promise<PublicPurchaseDTO | null> {
    const purchase = await this.purchaseRepository.getPlanHistoryById(id);
    return toPublicPurchaseDTO(purchase as PurchaseIF);
  }

  async getPlanHistory(page: number, limit: number): Promise<{purchases:PublicPurchaseDTO[],totalItems:number}> {
    const skip = (page - 1) * limit;
    const purchases = await this.purchaseRepository.getPlanHistory(skip,limit);
    const totalItems = await this.purchaseRepository.countPlanHistory();
    return {purchases:toPublicPurchaseDTOs(purchases as PurchaseIF[]),totalItems};
  }
}
