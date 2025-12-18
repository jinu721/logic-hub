import { BaseService } from "@core"
import { AppError, toObjectId } from "@utils/application"
import { HttpStatus } from "@constants"
import { IUserCommandService, IUserRepository, PublicUserDTO, toPublicUserDTO, toPublicUserDTOs } from "@modules/user"
import { IHashProvider } from "@providers/hashing"
import { UpdateUserInput, PopulatedUser, UserDocument } from "@shared/types"


export class UserCommandService
  extends BaseService<PopulatedUser, PublicUserDTO>
  implements IUserCommandService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashProv: IHashProvider
  ) {
    super();
  }

  protected toDTO(user: PopulatedUser): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: PopulatedUser[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  private async getPopulated(userId: string): Promise<PopulatedUser> {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return user;
  }

  async findUserByIdAndUpdate(id: string, data: Partial<UserDocument>) {

    const updated = await this.userRepo.updateUser(toObjectId(id), data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.mapOne(await this.getPopulated(id));
  }

  async updateUser(userId: string, data: UpdateUserInput) {
    const updateData: Partial<UserDocument> = {
      ...data,
      avatar: data.avatar ? toObjectId(data.avatar) : undefined,
      banner: data.banner ? toObjectId(data.banner) : undefined,
    } ; 

    const updated = await this.userRepo.updateUser(toObjectId(userId), updateData);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.mapOne(await this.getPopulated(userId));
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const valid = await this.hashProv.comparePasswords(
      oldPassword,
      user.password as string
    );
    if (!valid)
      throw new AppError(HttpStatus.UNAUTHORIZED, "Invalid old password");

    const hashed = await this.hashProv.hashPassword(newPassword);
    const updated = await this.userRepo.updateUser(toObjectId(userId), {
      password: hashed,
    });

    if (!updated)
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to update password"
      );

    return this.mapOne(await this.getPopulated(userId));
  }

  async toggleUserNotification(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const updated = await this.userRepo.updateUser(toObjectId(userId), {
      notifications: !user.notifications,
    });
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    return this.mapOne(await this.getPopulated(userId));
  }

  async toggleBanStatus(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const newStatus = !user.isBanned;
    await this.userRepo.updateUser(toObjectId(userId), { isBanned: newStatus });

    return { isBanned: newStatus };
  }
}
