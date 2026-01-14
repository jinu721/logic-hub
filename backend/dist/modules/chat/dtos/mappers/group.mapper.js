"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicGroupDTOs = exports.toPublicGroupDTO = void 0;
const dtos_1 = require("../../../user/dtos");
const isPopulatedUser = (user) => {
    return user !== null && typeof user === 'object' && 'username' in user;
};
const toPublicGroupDTO = (group) => {
    return {
        _id: group._id ? group._id.toString() : "",
        name: group.name,
        description: group.description,
        image: group.image,
        createdBy: isPopulatedUser(group.createdBy) ? (0, dtos_1.toPublicUserDTO)(group.createdBy) : {},
        admins: Array.isArray(group.admins) && group.admins.length > 0 && isPopulatedUser(group.admins[0])
            ? (0, dtos_1.toPublicUserDTOs)(group.admins)
            : [],
        members: Array.isArray(group.members) && group.members.length > 0 && isPopulatedUser(group.members[0])
            ? (0, dtos_1.toPublicUserDTOs)(group.members)
            : [],
        groupType: group.groupType,
        category: group.category || "General",
        tags: group.tags || [],
        userRequests: Array.isArray(group.userRequests) && group.userRequests.length > 0 && isPopulatedUser(group.userRequests[0])
            ? (0, dtos_1.toPublicUserDTOs)(group.userRequests)
            : [],
        isDeleted: group.isDeleted,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
    };
};
exports.toPublicGroupDTO = toPublicGroupDTO;
;
const toPublicGroupDTOs = (groups) => {
    return groups.map(exports.toPublicGroupDTO);
};
exports.toPublicGroupDTOs = toPublicGroupDTOs;
