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
exports.GroupMemberService = void 0;
const mongoose_1 = require("mongoose");
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
class GroupMemberService extends _core_1.BaseService {
    constructor(groupRepo, conversationRepo) {
        super();
        this.groupRepo = groupRepo;
        this.conversationRepo = conversationRepo;
    }
    toDTO(conv) {
        var _a;
        if (this.isPopulatedConversation(conv)) {
            return (0, dtos_1.toPublicConversationDTO)(conv);
        }
        // Handle non-populated conversation
        return {
            _id: ((_a = conv._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            type: conv.type,
            participants: [],
            latestMessage: null,
            isDeleted: conv.isDeleted,
            typingUsers: [],
            unreadCounts: conv.unreadCounts instanceof Map
                ? Object.fromEntries(conv.unreadCounts)
                : conv.unreadCounts || {},
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
        };
    }
    isPopulatedConversation(conv) {
        return conv !== null && typeof conv === 'object' && 'participants' in conv &&
            Array.isArray(conv.participants) &&
            conv.participants.length > 0 &&
            typeof conv.participants[0] === 'object' &&
            'username' in conv.participants[0];
    }
    toDTOs(_) {
        return [];
    }
    addMembers(groupId, memberIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.addMembers(groupId, memberIds);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const conv = yield this.conversationRepo.addParticipants(groupId, group.members);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    removeMember(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const removed = yield this.groupRepo.removeMember(groupId, userId);
            if (!removed)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const conv = yield this.conversationRepo.removeParticipants(groupId, [
                new mongoose_1.Types.ObjectId(userId),
            ]);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    makeAdmin(conversationId, groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findGroupById(groupId);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const uid = new mongoose_1.Types.ObjectId(userId);
            const isMember = group.members.some((m) => (m._id || m).toString() === userId);
            if (!isMember)
                throw new application_1.AppError(_constants_1.HttpStatus.BAD_REQUEST, "User not a member");
            group.members = group.members.filter((m) => (m._id || m).toString() !== userId);
            const isAdmin = group.admins.some((a) => (a._id || a).toString() === userId);
            if (!isAdmin) {
                group.admins.push(uid);
            }
            yield this.groupRepo.saveGroup(group);
            const conv = yield this.conversationRepo.findConversationById(conversationId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    removeAdmin(conversationId, groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findGroupById(groupId);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const uid = new mongoose_1.Types.ObjectId(userId);
            group.admins = group.admins.filter((a) => (a._id || a).toString() !== userId);
            const isMember = group.members.some((m) => (m._id || m).toString() === userId);
            if (!isMember) {
                group.members.push(uid);
            }
            yield this.groupRepo.saveGroup(group);
            const conv = yield this.conversationRepo.findConversationById(conversationId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    sendJoinRequest(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const group = yield this.groupRepo.findGroupById(groupId);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const uid = new mongoose_1.Types.ObjectId(userId);
            const alreadyIn = [...group.members, ...group.admins].some((u) => (u._id || u).toString() === userId);
            if (alreadyIn)
                throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "User already in group");
            let updatedGroup = group;
            if (group.groupType === "public-open") {
                group.members.push(uid);
                updatedGroup = (yield this.groupRepo.saveGroup(group));
                const conv = yield this.conversationRepo.findConversationByGroup(groupId);
                if (!conv)
                    throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
                // Handle participants properly - check if it's populated or not
                if (this.isPopulatedConversation(conv)) {
                    // For populated conversation, we need to add the user ID to the participants array
                    // This is a type issue - we can't directly add ObjectId to PopulatedUser[]
                    // We need to refetch the conversation after adding the participant
                    yield this.conversationRepo.addParticipants(groupId, [uid]);
                    const refreshedConv = yield this.conversationRepo.findConversationById(conv._id.toString());
                    if (!refreshedConv)
                        throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
                    return {
                        updatedConversation: this.toDTO(refreshedConv),
                        userId,
                        conversationId: refreshedConv._id.toString(),
                        newGroupData: (0, dtos_1.toPublicGroupDTO)(updatedGroup),
                    };
                }
                else {
                    // For non-populated conversation, handle participants as ObjectId[]
                    const nonPopulatedConv = conv;
                    const currentParticipants = nonPopulatedConv.participants;
                    nonPopulatedConv.participants = Array.from(new Set([...currentParticipants.map(p => p.toString()), uid.toString()])).map(id => new mongoose_1.Types.ObjectId(id));
                    const saved = yield this.conversationRepo.saveConversation(nonPopulatedConv);
                    return {
                        updatedConversation: saved ? this.toDTO(saved) : null,
                        userId,
                        conversationId: ((_a = saved === null || saved === void 0 ? void 0 : saved._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        newGroupData: (0, dtos_1.toPublicGroupDTO)(updatedGroup),
                    };
                }
            }
            group.userRequests.push(uid);
            updatedGroup = (yield this.groupRepo.saveGroup(group));
            const conv = yield this.conversationRepo.findConversationByGroup(groupId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return {
                updatedConversation: null,
                userId,
                conversationId: conv._id.toString(),
                newGroupData: (0, dtos_1.toPublicGroupDTO)(updatedGroup),
            };
        });
    }
    acceptJoinRequest(conversationId, groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findGroupById(groupId);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const uid = new mongoose_1.Types.ObjectId(userId);
            if (group.members.some((m) => (m._id || m).toString() === userId))
                throw new application_1.AppError(_constants_1.HttpStatus.CONFLICT, "Already a member");
            group.members.push(uid);
            group.userRequests = group.userRequests.filter((r) => (r._id || r).toString() !== userId);
            yield this.groupRepo.saveGroup(group);
            const conv = yield this.conversationRepo.findConversationById(conversationId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            // Handle participants properly
            if (this.isPopulatedConversation(conv)) {
                // For populated conversation, use the repository method to add participants
                yield this.conversationRepo.addParticipants(conversationId, [uid]);
                const refreshedConv = yield this.conversationRepo.findConversationById(conversationId);
                if (!refreshedConv)
                    throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
                return this.toDTO(refreshedConv);
            }
            else {
                // For non-populated conversation, handle participants as ObjectId[]
                const nonPopulatedConv = conv;
                const currentParticipants = nonPopulatedConv.participants;
                if (!currentParticipants.some((p) => p.toString() === userId)) {
                    currentParticipants.push(uid);
                }
                const saved = yield this.conversationRepo.saveConversation(nonPopulatedConv);
                return saved ? this.toDTO(saved) : this.toDTO(nonPopulatedConv);
            }
        });
    }
    leaveGroup(conversationId, groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.groupRepo.findGroupById(groupId);
            if (!group)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
            const uid = new mongoose_1.Types.ObjectId(userId);
            group.members = group.members.filter((m) => (m._id || m).toString() !== userId);
            group.admins = group.admins.filter((a) => (a._id || a).toString() !== userId);
            yield this.groupRepo.saveGroup(group);
            const conv = yield this.conversationRepo.removeParticipants(groupId, [uid]);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
}
exports.GroupMemberService = GroupMemberService;
