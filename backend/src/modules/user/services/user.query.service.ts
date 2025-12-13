import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IUserQueryService,
  IUserRepository,
  PublicUserDTO,
  toPublicUserDTO,
  toPublicUserDTOs
} from "@modules/user";
import { ISubmissionRepository } from "@modules/challenge";
import { UserDocument } from "@modules/user/models";


export class UserQueryService
  extends BaseService<UserDocument, PublicUserDTO>
  implements IUserQueryService
{
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _submissionRepo: ISubmissionRepository
  ) {
    super();
  }

  protected toDTO(user: UserDocument): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: UserDocument[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  private async buildUserData(user: UserDocument, currentUserId: string) {
    const rank = await this._userRepo.findUserRank(user._id as string);
    const completedDomains = await this._submissionRepo.findCompletedDomainsByUser(
      toObjectId(user._id as string)
    );

    return {
      ...this.mapOne(user),
      userRank: rank,
      completedDomains: completedDomains,
      currentUser: user._id?.toString() === currentUserId,
    } as PublicUserDTO;
  }

  async findByEmailOrUsername(value: string) {
    const exists = await this._userRepo.getByEmailOrUsername(value);
    return !exists;
  }

  async getUserByEmail(email: string) {
    const user = await this._userRepo.getUserByEmail(email);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.buildUserData(user, email);
  }

  async findUserById(id: string) {
    const user = await this._userRepo.getUserById(id);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.buildUserData(user, id);
  }

  async findUserByName(username: string, currentUserId: string) {
    const user = await this._userRepo.getByEmailOrUsername(username);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.buildUserData(user, currentUserId);
  }

  async findUsers(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      this._userRepo.findAllUsers(search, skip, limit),
      this._userRepo.countAllUsers(search),
    ]);

    if (!users || users.length === 0)
      throw new AppError(HttpStatus.NOT_FOUND, "Users not found");

    return { users: this.mapMany(users), totalItems };
  }

  async searchUsers(search: string) {
    const users = await this._userRepo.searchUsers(search);
    if (!users || users.length === 0)
      throw new AppError(HttpStatus.NOT_FOUND, "Users not found");
    return this.mapMany(users);
  }
}
