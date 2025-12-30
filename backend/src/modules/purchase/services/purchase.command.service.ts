import { addMonths, addYears } from "date-fns"
import { HttpStatus } from "@constants"
import {
  PublicPurchaseDTO,
  toPublicPurchaseDTO,
  toPublicPurchaseDTOs,
  IPurchaseRepository,
  IPurchaseCommandService
} from "@modules/purchase"
import {
    IMembershipRepository
} from "@modules/membership"
import {
    IUserRepository
} from "@modules/user"
import { PurchaseDocument } from "@shared/types"
import { AppError, toObjectId } from "@utils/application"
import { BaseService } from "@core"


export class PurchaseCommandService extends BaseService<PurchaseDocument, PublicPurchaseDTO> implements IPurchaseCommandService {
  constructor(
    private purchaseRepo: IPurchaseRepository,
    private membershipRepo: IMembershipRepository,
    private userRepo: IUserRepository,
  ) {
    super();
  }

  protected toDTO(purchase: PurchaseDocument): PublicPurchaseDTO {
    return toPublicPurchaseDTO(purchase);
  }

  protected toDTOs(purchases: PurchaseDocument[]): PublicPurchaseDTO[] {
    return toPublicPurchaseDTOs(purchases);
  }

  async createPlanPurchase(data: Partial<PurchaseDocument>): Promise<PublicPurchaseDTO> {
    const now = new Date();

    const plan = await this.membershipRepo.getPlanById(String(data.planId));
    if (!plan) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership plan not found");
    }

    const expiresAt =
      plan.type === "silver" ? addMonths(now, 1) : addYears(now, 1);

    const purchase = await this.purchaseRepo.createPlanPurchase({
      ...data,
      startedAt: now,
      expiresAt,
    } as PurchaseDocument);

    if (!data.userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const userObjectId = toObjectId(String(data.userId!));
    await this.userRepo.updateUser(userObjectId, {
      membership: {
        planId: String(data.planId),
        startedAt: now,
        expiresAt,
        type: plan.type,
        isActive: true,
      },
    });

    return this.toDTO(purchase);
  }
}
