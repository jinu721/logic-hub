"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicConversationDTOs = exports.toPublicConversationDTO = void 0;
const dtos_1 = require("../../../user/dtos");
const message_mapper_1 = require("./message.mapper");
const toPublicConversationDTO = (conversation) => {
    const isPopulatedMessage = (doc) => doc !== null && typeof doc === 'object' && 'sender' in doc;
    const isPopulatedUser = (doc) => doc !== null && typeof doc === 'object' && 'username' in doc;
    return {
        _id: conversation._id.toString(),
        type: conversation.type,
        participants: conversation.participants && conversation.participants.every(isPopulatedUser)
            ? conversation.participants.map(dtos_1.toPublicUserDTO)
            : [],
        latestMessage: conversation.latestMessage && isPopulatedMessage(conversation.latestMessage)
            ? (0, message_mapper_1.toPublicMessageDTO)(conversation.latestMessage)
            : null,
        isDeleted: conversation.isDeleted,
        typingUsers: conversation.typingUsers && conversation.typingUsers.length ? conversation.typingUsers.map(dtos_1.toPublicUserDTO) : [],
        unreadCounts: conversation.unreadCounts instanceof Map
            ? Object.fromEntries(conversation.unreadCounts)
            : conversation.unreadCounts || {},
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };
};
exports.toPublicConversationDTO = toPublicConversationDTO;
const toPublicConversationDTOs = (conversations) => {
    return conversations.map(exports.toPublicConversationDTO);
};
exports.toPublicConversationDTOs = toPublicConversationDTOs;
