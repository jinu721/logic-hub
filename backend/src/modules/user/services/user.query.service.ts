import { BaseService } from "@core"
import { AppError, toObjectId } from "@utils/application"
import { HttpStatus } from "@constants"
import {
  IUserQueryService,
  IUserRepository,
  PublicUserDTO,
  toPublicUserDTO,
  toPublicUserDTOs
} from "@modules/user"
import { UserIF } from "@shared/types"
// import { IChallengeProgressRepository } from "@modules/submission"


export class UserQueryService
  extends BaseService<UserIF, PublicUserDTO>
  implements IUserQueryService
{
  constructor(
    private readonly userRepo: IUserRepository,
    // private readonly progressRepo: IChallengeProgressRepository
  ) {
    super();
  }

  protected toDTO(user: UserIF): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: UserIF[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  private async buildUserData(user: UserIF, currentUserId: string) {
    const rank = await this.userRepo.findUserRank(user._id as string);
    // const completedDomains = await this.progressRepo.findCompletedDomainsByUser(
    //   toObjectId(user._id as string)
    // );

    return {
      ...this.mapOne(user),
      userRank: rank,
      completedDomains:[],
      currentUser: user._id?.toString() === currentUserId,
    } as PublicUserDTO;
  }

  async findByEmailOrUsername(value: string) {
    const exists = await this.userRepo.getByEmailOrUsername(value);
    return !exists;
  }

  async findUserById(id: string) {
    const user = await this.userRepo.getUserById(id);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.buildUserData(user, id);
  }

  async findUserByName(username: string, currentUserId: string) {
    const user = await this.userRepo.getByEmailOrUsername(username);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.buildUserData(user, currentUserId);
  }

  async findUsers(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      this.userRepo.findAllUsers(search, skip, limit),
      this.userRepo.countAllUsers(search),
    ]);

    if (!users || users.length === 0)
      throw new AppError(HttpStatus.NOT_FOUND, "Users not found");

    return { users: this.mapMany(users), totalItems };
  }

  async searchUsers(search: string) {
    const users = await this.userRepo.searchUsers(search);
    if (!users || users.length === 0)
      throw new AppError(HttpStatus.NOT_FOUND, "Users not found");
    return this.mapMany(users);
  }
}
