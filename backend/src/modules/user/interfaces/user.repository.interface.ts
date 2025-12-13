import { Types } from "mongoose";
import { UserDocument } from "@modules/user";

export interface IUserRepository {
    createUser(user: Partial<UserDocument>): Promise<UserDocument>;
    getByEmailOrUsername(value: string): Promise<UserDocument | null>;
    getUserByEmail(email: string): Promise<UserDocument | null>;
    getUserByName(role: string): Promise<UserDocument | null>;
    updateUser(userId: Types.ObjectId, updateData: Partial<UserDocument>): Promise<UserDocument | null>;
    verifyAccount(email: string): Promise<UserDocument | null>;
    findUserRank(userId: string): Promise<number>;
    countAllUsers(search: string): Promise<number>;
    findAllUsers(search: string,skip: number,limit: number): Promise<UserDocument[] | null>;
    getUserById(userId:string): Promise<UserDocument| null>;
    searchUsers(search:string): Promise<UserDocument[]| null>;
    cancelMembership(userId: Types.ObjectId): Promise<UserDocument | null>;
    saveUser(user: UserDocument): Promise<UserDocument | null>;
}
