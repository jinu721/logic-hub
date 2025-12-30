import { UserDocument } from "@modules/user";
import { Query } from "mongoose";

export const populateUser = (
  query: Query<unknown, unknown>
): Query<unknown, unknown> => {
  return query
    .populate("avatar")
    .populate("banner")
    .populate("inventory.ownedAvatars")
    .populate("inventory.ownedBanners")
    .populate("inventory.badges")
    .populate("membership.planId");
};
