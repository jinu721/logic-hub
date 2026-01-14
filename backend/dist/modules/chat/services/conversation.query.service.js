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
exports.ConversationQueryService = void 0;
const _core_1 = require("../../../shared/core");
const application_1 = require("../../../shared/utils/application");
const _constants_1 = require("../../../shared/constants");
const dtos_1 = require("../../chat/dtos");
const dtos_2 = require("../../user/dtos");
class ConversationQueryService extends _core_1.BaseService {
    constructor(conversationRepo, groupRepo, userRepo) {
        super();
        this.conversationRepo = conversationRepo;
        this.groupRepo = groupRepo;
        this.userRepo = userRepo;
    }
    toDTO(conv) {
        var _a;
        // If it's already populated, use the existing mapper
        if (this.isPopulatedConversation(conv)) {
            return (0, dtos_1.toPublicConversationDTO)(conv);
        }
        // Handle non-populated conversation
        const base = {
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
        return base;
    }
    isPopulatedConversation(conv) {
        return conv.participants && conv.participants.length > 0 &&
            typeof conv.participants[0] === 'object' && 'username' in conv.participants[0];
    }
    toDTOs(convs) {
        return convs.map((c) => this.toDTO(c));
    }
    findOneToOne(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            const conv = yield this.conversationRepo.findOneToOne(userA, userB);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    getConversationById(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conv = yield this.conversationRepo.findConversationById(conversationId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
    findConversation(conversationId, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!currentUserId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const conv = yield this.conversationRepo.findConversationById(conversationId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            let group;
            let otherUser;
            if (conv.type === "group" && conv.groupId) {
                const found = yield this.groupRepo.findGroupById(conv.groupId.toString());
                if (!found)
                    throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Group not found");
                group = (0, dtos_1.toPublicGroupDTO)(found);
            }
            if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
                const other = (conv.participants).find((u) => { var _a; return ((_a = u._id) === null || _a === void 0 ? void 0 : _a.toString()) !== currentUserId.toString(); });
                if (other) {
                    const user = yield this.userRepo.getUserById(other._id.toString());
                    if (!user)
                        throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "User not found");
                    otherUser = (0, dtos_2.toPublicUserDTO)(user);
                }
            }
            const dto = this.toDTO(conv);
            return Object.assign(Object.assign({}, dto), { group,
                otherUser,
                currentUserId });
        });
    }
    findConversations(userId, search) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw new application_1.AppError(_constants_1.HttpStatus.UNAUTHORIZED, "Unauthorized");
            const convs = yield this.conversationRepo.findConversationsByUser(userId);
            if (!convs || convs.length === 0)
                return [];
            const result = yield Promise.all(convs.map((conv) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                let group;
                let otherUser;
                if (conv.type === "group" && conv.groupId) {
                    const found = yield this.groupRepo.findGroupById(conv.groupId.toString());
                    if (found)
                        group = (0, dtos_1.toPublicGroupDTO)(found);
                }
                else if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
                    const other = conv.participants.find((u) => {
                        var _a;
                        if (u && typeof u === 'object' && '_id' in u) {
                            return ((_a = u._id) === null || _a === void 0 ? void 0 : _a.toString()) !== userId.toString();
                        }
                        return (u === null || u === void 0 ? void 0 : u.toString()) !== userId.toString();
                    });
                    if (other) {
                        const userId = other && typeof other === 'object' && '_id' in other
                            ? (_a = other._id) === null || _a === void 0 ? void 0 : _a.toString()
                            : other === null || other === void 0 ? void 0 : other.toString();
                        const user = yield this.userRepo.getUserById(userId || "");
                        if (user)
                            otherUser = (0, dtos_2.toPublicUserDTO)(user);
                    }
                }
                const dto = this.toDTO(conv);
                return Object.assign(Object.assign({}, dto), { group, otherUser });
            })));
            return result;
        });
    }
    findConversationByGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const conv = yield this.conversationRepo.findConversationByGroup(groupId);
            if (!conv)
                throw new application_1.AppError(_constants_1.HttpStatus.NOT_FOUND, "Conversation not found");
            return this.toDTO(conv);
        });
    }
}
exports.ConversationQueryService = ConversationQueryService;
