import { PublicMessageDTO } from "../../mappers/message.dto";
import { MessageIF } from "../../types/message.types";

export interface IMessageService {
    createMessage(data: MessageIF & { replyTo?: string },accessToken:string): Promise<PublicMessageDTO>;
    getMessages(limit: number, query: any): Promise<PublicMessageDTO[]>;
    editMessage(messageId: string, newText: string): Promise<PublicMessageDTO | null>;
    deleteMessage(messageId: string): Promise<PublicMessageDTO | null>;
    addReaction(messageId: string, userId: string, reaction: string): Promise<PublicMessageDTO | null>;
    removeReaction(messageId: string, userId: string, reaction: string): Promise<PublicMessageDTO | null>;
    markAsSeen(messageId: string, userId: string): Promise<PublicMessageDTO | null>;
    getMessageById(messageId: string): Promise<PublicMessageDTO | null>;
}
