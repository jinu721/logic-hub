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
exports.GroupHandler = void 0;
const generate_message_1 = require("../../shared/utils/application/generate.message");
const mongoose_1 = require("mongoose");
class GroupHandler {
    constructor(io, container) {
        this.io = io;
        this.container = container;
    }
    setupGroupHandlers(socket) {
        socket.on("update_group", this.handleUpdateGroup.bind(this, socket));
        socket.on("join_conversation", this.handleJoinConversation.bind(this, socket));
    }
    handleJoinConversation(socket, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            socket.join(conversationId);
        });
    }
    handleUpdateGroup(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { type, conversationId, groupId, members, userId, newGroupData, removeMember, }) {
            try {
                console.log("Group Update Data:-", type, conversationId, groupId, members, userId, newGroupData, removeMember);
                let updatedConversation = null;
                let finalConversationId = conversationId;
                let finalUserId = userId;
                let finalNewGroupData;
                switch (type) {
                    case "add_members":
                        updatedConversation = yield this.container.groupMemberSvc.addMembers(groupId, members || []);
                        break;
                    case "remove_member":
                        updatedConversation = yield this.container.groupMemberSvc.removeMember(groupId, removeMember || "");
                        break;
                    case "make_admin":
                        updatedConversation = yield this.container.groupMemberSvc.makeAdmin(conversationId, groupId, userId || "");
                        break;
                    case "remove_admin":
                        updatedConversation = yield this.container.groupMemberSvc.removeAdmin(conversationId, groupId, userId || "");
                        break;
                    case "edit_group_info":
                        finalNewGroupData = newGroupData; // Assign this so it's passed to system message
                        let editedGroupDocument = {
                            name: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.name,
                            description: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.description,
                            image: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.image,
                            members: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.members,
                            admins: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.admins,
                            groupType: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.groupType,
                            userRequests: newGroupData === null || newGroupData === void 0 ? void 0 : newGroupData.userRequests,
                        };
                        const editResult = yield this.container.groupCommandSvc.updateGroupInfo(conversationId, groupId, editedGroupDocument);
                        updatedConversation = editResult;
                        break;
                    case "leave_group":
                        updatedConversation = yield this.container.groupMemberSvc.leaveGroup(conversationId, groupId, userId || "");
                        break;
                    case "delete_group":
                        const deleteResult = yield this.container.groupCommandSvc.deleteGroup(groupId);
                        updatedConversation = deleteResult ? true : null;
                        break;
                    case "join_group":
                        console.log("JOIN GROUP");
                        const data = yield this.container.groupMemberSvc.sendJoinRequest(groupId, userId || "");
                        console.log("Data After Join", data);
                        finalConversationId = String(data.conversationId);
                        finalUserId = data.userId;
                        finalNewGroupData = data.newGroupData;
                        updatedConversation = data.updatedConversation;
                        break;
                    case "approve_group":
                        updatedConversation =
                            yield this.container.groupMemberSvc.acceptJoinRequest(conversationId, groupId, userId || "");
                        break;
                    default:
                        throw new Error("Invalid group update type");
                }
                if (updatedConversation &&
                    finalConversationId &&
                    mongoose_1.Types.ObjectId.isValid(finalConversationId.toString())) {
                    try {
                        const systemMsg = yield (0, generate_message_1.generateSystemMessage)(this.container, type, finalConversationId, finalUserId, members, finalNewGroupData, removeMember);
                        if (systemMsg) {
                            this.io
                                .to(finalConversationId.toString())
                                .emit("receive_message", { conversationId: systemMsg.conversationId, message: systemMsg });
                        }
                        const updatedGroup = yield this.container.groupQuerySvc.findGroupById(groupId);
                        // Only emit group_updated if we have a valid conversation object
                        if (typeof updatedConversation === 'object' && updatedConversation !== null) {
                            this.io.to(finalConversationId.toString()).emit("group_updated", {
                                conversationId: finalConversationId,
                                updatedMembers: updatedConversation.participants,
                                groupInfo: updatedGroup,
                                removeMember,
                                type,
                            });
                        }
                        else {
                            // For delete operations or other boolean results
                            this.io.to(finalConversationId.toString()).emit("group_updated", {
                                conversationId: finalConversationId,
                                updatedMembers: [],
                                groupInfo: updatedGroup,
                                removeMember,
                                type,
                            });
                        }
                    }
                    catch (socketErr) {
                        console.error("Socket room/message error:", socketErr);
                        socket.emit("send_error", {
                            message: "Group updated but failed to emit socket events.",
                        });
                    }
                }
                else {
                    console.warn("No conversation update or invalid conversation ID");
                }
            }
            catch (err) {
                console.error("Socket Error in handleUpdateGroup:", err);
                socket.emit("send_error", {
                    message: err instanceof Error
                        ? err.message
                        : "Unexpected error during group update",
                });
            }
        });
    }
}
exports.GroupHandler = GroupHandler;
