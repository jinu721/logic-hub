"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicMessageDTOs = exports.toPublicMessageDTO = void 0;
const dtos_1 = require("../../../user/dtos");
const toPublicMessageDTO = (message) => {
    var _a, _b, _c, _d, _e, _f;
    const SYSTEM_USER_ID = "000000000000000000000000";
    const senderId = ((_b = (_a = message.sender) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || ((_c = message.sender) === null || _c === void 0 ? void 0 : _c.toString());
    const isSystemSender = senderId === SYSTEM_USER_ID;
    const isSystemMessage = message.type === "system" || isSystemSender;
    const getSafeId = (user) => {
        if (user && typeof user === 'object' && '_id' in user) {
            const id = user._id;
            return (id === null || id === void 0 ? void 0 : id.toString()) || '';
        }
        return (user === null || user === void 0 ? void 0 : user.toString()) || '';
    };
    return {
        _id: message._id.toString(),
        conversationId: message.conversationId.toString(),
        sender: isSystemMessage
            ? {
                _id: SYSTEM_USER_ID,
                username: "System",
                avatar: null,
                banner: null,
                bio: undefined,
            }
            : (message.sender && typeof message.sender === 'object' && 'username' in message.sender
                ? (0, dtos_1.toPublicUserDTO)(message.sender)
                : { _id: senderId, username: "Unknown", email: "", avatar: null, bio: "" }),
        content: message.content,
        type: message.type,
        mentionedUsers: ((_d = message.mentionedUsers) === null || _d === void 0 ? void 0 : _d.map(getSafeId)) || [],
        seenBy: ((_e = message.seenBy) === null || _e === void 0 ? void 0 : _e.map(u => typeof u === 'object' && 'username' in u
            ? (0, dtos_1.toPublicUserDTO)(u)
            : getSafeId(u))) || [],
        media: message.media,
        reactions: ((_f = message.reactions) === null || _f === void 0 ? void 0 : _f.map(r => ({
            emoji: r.emoji,
            userId: getSafeId(r.userId),
        }))) || [],
        replyTo: message.replyTo && typeof message.replyTo === 'object' && '_id' in message.replyTo
            ? (0, exports.toPublicMessageDTO)(message.replyTo)
            : null,
        isEdited: message.isEdited,
        isDeleted: message.isDeleted,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
    };
};
exports.toPublicMessageDTO = toPublicMessageDTO;
const toPublicMessageDTOs = (messages) => {
    return messages.map(exports.toPublicMessageDTO);
};
exports.toPublicMessageDTOs = toPublicMessageDTOs;
