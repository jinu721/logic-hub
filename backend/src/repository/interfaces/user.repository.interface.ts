import { Types } from "mongoose";
import { UserIF } from "../../types/user.types";

export interface IUserRepository {
    getByEmailOrUsername(value: string): Promise<UserIF | null>;
    getAllByRole(role: string): Promise<UserIF[]>;
    getUserByName(role: string): Promise<UserIF | null>;
    update(userId: Types.ObjectId, updateData: Partial<UserIF>): Promise<UserIF | null>;
    verifyAccount(email: string): Promise<UserIF | null>;
    findUserRank(userId: string): Promise<number>;
    countAllUsers(search: string): Promise<number>;
    findAllUsers(search: string,skip: number,limit: number): Promise<UserIF[] | null>;
    getUserById(userId:string): Promise<UserIF| null>;
    searchUsers(search:string): Promise<UserIF[]| null>;
}
