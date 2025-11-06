import { Types } from "mongoose";
import { UserIF } from "@shared/types";

export interface IUserRepository {
    createUser(user: {username:string,email:string,password:string}): Promise<void>;
    getByEmailOrUsername(value: string): Promise<UserIF | null>;
    getUserByName(role: string): Promise<UserIF | null>;
    updateUser(userId: Types.ObjectId, updateData: Partial<UserIF>): Promise<UserIF | null>;
    verifyAccount(email: string): Promise<UserIF | null>;
    findUserRank(userId: string): Promise<number>;
    countAllUsers(search: string): Promise<number>;
    findAllUsers(search: string,skip: number,limit: number): Promise<UserIF[] | null>;
    getUserById(userId:string): Promise<UserIF| null>;
    searchUsers(search:string): Promise<UserIF[]| null>;
    cancelMembership(userId: Types.ObjectId): Promise<UserIF | null>;
}
