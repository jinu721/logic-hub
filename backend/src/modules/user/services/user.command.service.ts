import { BaseService } from "@core"
import { AppError, toObjectId } from "@utils/application"
import { HttpStatus } from "@constants"
import { IUserCommandService, IUserRepository, PublicUserDTO, toPublicUserDTO, toPublicUserDTOs, UpdateUserDTO } from "@modules/user"
import { IHashProvider } from "@providers/hashing"
import { UserIF } from "@shared/types"


export class UserCommandService
  extends BaseService<UserIF, PublicUserDTO>
  implements IUserCommandService
{
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashProv: IHashProvider
  ) {
    super();
  }

  protected toDTO(user: UserIF): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: UserIF[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  async findUserByIdAndUpdate(id: string, data: Partial<UserIF>) {
    const updated = await this.userRepo.updateUser(toObjectId(id), data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.mapOne(updated);
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const updated = await this.userRepo.updateUser(toObjectId(userId), data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return this.mapOne(updated);
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

    return this.mapOne(updated);
  }

  async toggleUserNotification(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const updated = await this.userRepo.updateUser(toObjectId(userId), {
      notifications: !user.notifications,
    });
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    return this.mapOne(updated);
  }

  async toggleBanStatus(userId: string) {
    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const newStatus = !user.isBanned;
    await this.userRepo.updateUser(toObjectId(userId), { isBanned: newStatus });

    return { isBanned: newStatus };
  }
}
