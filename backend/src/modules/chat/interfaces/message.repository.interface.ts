import { MessageIF, MessageQueryFilter } from "@shared/types";

export interface IMessageRepository {
  createMessage(data: MessageIF & { replyTo?: string }): Promise<MessageIF>
  getMessages(limit: number, query: MessageQueryFilter): Promise<MessageIF[]>;
  editMessage(messageId: string, newText: string): Promise<MessageIF | null>;
  deleteMessage(messageId: string): Promise<MessageIF | null>;
  addReaction(messageId: string, userId: string, reaction: string): Promise<MessageIF | null>;
  removeReaction(messageId: string, userId: string, reaction: string): Promise<MessageIF | null>;
  markAsSeen(messageId: string, userId: string): Promise<MessageIF | null>;
  getMessageById(messageId: string): Promise<MessageIF | null>
  findMessageById(messageId: string): Promise<MessageIF | null>
  save(message: MessageIF): Promise<MessageIF | null>
  closePoll(messageId: string): Promise<MessageIF | null>
  markMessagesAsSeen(conversationId: string, userId: string): Promise<void>
}
