"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSystemMessage = void 0;
const mongoose_1 = require("mongoose");
const generateSystemMessage = (container, type, conversationId, userId, members, newGroupData, removeMemberId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const actingUser = yield container.userQuerySvc.findUserById(userId);
    if (!actingUser)
        return null;
    let removedMemberName = "";
    if (removeMemberId) {
        const removedUser = yield container.userQuerySvc.findUserById(removeMemberId);
        removedMemberName = (_a = removedUser === null || removedUser === void 0 ? void 0 : removedUser.username) !== null && _a !== void 0 ? _a : "";
    }
    const memberUsers = yield Promise.all(members.map((id) => container.userQuerySvc.findUserById(id)));
    const memberNames = memberUsers.map((u) => u.username).join(", ");
    let content;
    switch (type) {
        case "add_members":
            content = `${actingUser.username} added ${memberNames} to the group`;
            break;
        case "remove_member":
            content = `${actingUser.username} removed ${removedMemberName} from the group`;
            break;
        case "make_admin":
            content = `${actingUser.username} became an admin`;
            break;
        case "remove_admin":
            content = `${actingUser.username} is no longer an admin`;
            break;
        case "edit_group_info":
            content = `${actingUser.username} changed group name to '${newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.name}'`;
            break;
        case "leave_group":
            content = `${actingUser.username} left the group`;
            break;
        case "delete_group":
            content = `${actingUser.username} deleted the group`;
            break;
        case "join_group":
        case "approve_group":
            content = `${actingUser.username} joined the group`;
            break;
        default:
            return null;
    }
    const systemMessage = {
        sender: new mongoose_1.Types.ObjectId(),
        conversationId: new mongoose_1.Types.ObjectId(conversationId),
        type: "system",
        content,
        mentionedUsers: [],
        seenBy: [],
        isEdited: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return yield container.messageCommandSvc.createMessageWithSender(systemMessage, null);
});
exports.generateSystemMessage = generateSystemMessage;
