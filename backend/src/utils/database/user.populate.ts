import { Query } from "mongoose";
import { UserIF } from "../../types/user.types";

export const populateUser = <T>(
  query: Query<T, UserIF>
): Query<T, UserIF> => {
  return query
    .populate("avatar")
    .populate("banner")
    .populate("inventory.ownedAvatars")
    .populate("inventory.ownedBanners")
    .populate("inventory.badges")
    .populate("membership.planId");
};
