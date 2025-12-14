import { UserDocument } from "@modules/user";
import { Query } from "mongoose";

export const populateUser = <T>(
  query: Query<T, UserDocument>
): Query<T, UserDocument> => {
  return query
    .populate("avatar")
    .populate("banner")
    .populate("inventory.ownedAvatars")
    .populate("inventory.ownedBanners")
    .populate("inventory.badges")
    .populate("membership.planId");
};
