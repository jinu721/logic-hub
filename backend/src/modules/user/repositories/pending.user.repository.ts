import { pendingModel, IPendingUserRepository } from "@modules/user"
import { PendingUserIF } from "@shared/types"
import { BaseRepository } from "@core"



export class PendingUserRepository extends BaseRepository<PendingUserIF> implements IPendingUserRepository  {
    constructor() {
        super(pendingModel);
    }
    async createPendingUser(pendingUser: Omit<PendingUserIF, "crateadAt" | "expiresAt" | "expiresAt">): Promise<any> {
        return await this.create(pendingUser);
    }
    async findPendingUserByEmail(email: string): Promise<PendingUserIF | null> {
        return await this.findOne({ email });
    }
    async deletePendingUser(email: string): Promise<any> {
        return await this.deleteOne({ email });
    }
    async updatePendingUserOtp(email: string, otp: number): Promise<any> {
        return await this.updateOne({ email }, { otp });
    }
}