import { Types, UpdateQuery } from "mongoose";
import { UserDocument, PopulatedUser } from "@shared/types";

export interface IUserRepository {
    createUser(user: Partial<UserDocument>): Promise<UserDocument>;

    getByEmailOrUsername(value: string): Promise<PopulatedUser | null>;
    getUserByEmail(email: string): Promise<PopulatedUser | null>;
    getUserByName(username: string): Promise<PopulatedUser | null>;
    getUserById(userId: string): Promise<PopulatedUser | null>;
    findAllUsers(search: string, skip: number, limit: number): Promise<PopulatedUser[]>;
    searchUsers(search: string): Promise<PopulatedUser[]>;
    findUsersByIds(userIds: Types.ObjectId[]): Promise<PopulatedUser[]>;
    getAllByRole(role: string): Promise<UserDocument[]>;

    updateUser(userId: Types.ObjectId, updateData: UpdateQuery<UserDocument>): Promise<UserDocument | null>;
    verifyAccount(email: string): Promise<UserDocument | null>;
    cancelMembership(userId: Types.ObjectId): Promise<UserDocument | null>;
    saveUser(user: UserDocument): Promise<UserDocument | null>;
    updateUserLevel(userId: string, level: number): Promise<UserDocument | null>;
    updateUserXP(userId: string, xp: number): Promise<UserDocument | null>;

    findUserRank(userId: string): Promise<number>;
    countAllUsers(search: string): Promise<number>;
}
