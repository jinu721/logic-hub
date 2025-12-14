import { MessageDocument, PopulatedMessage, MessageQueryFilter } from "@shared/types";

export interface IMessageRepository {
  createMessage(data: MessageDocument & { replyTo?: string }): Promise<MessageDocument>
  getMessages(limit: number, query: MessageQueryFilter): Promise<PopulatedMessage[]>;
  editMessage(messageId: string, newText: string): Promise<MessageDocument | null>;
  deleteMessage(messageId: string): Promise<MessageDocument | null>;
  addReaction(messageId: string, userId: string, reaction: string): Promise<MessageDocument | null>;
  removeReaction(messageId: string, userId: string, reaction: string): Promise<MessageDocument | null>;
  markAsSeen(messageId: string, userId: string): Promise<MessageDocument | null>;
  getMessageById(messageId: string): Promise<PopulatedMessage | null>
  findMessageById(messageId: string): Promise<PopulatedMessage | null>
  save(message: MessageDocument): Promise<MessageDocument | null>
  closePoll(messageId: string): Promise<MessageDocument | null>
  markMessagesAsSeen(conversationId: string, userId: string): Promise<void>
}
