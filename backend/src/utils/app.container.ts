import { MessageService } from "../services/implements/message.service";
import { GroupService } from "../services/implements/group.service";
import { MessageRepository } from "../repository/implements/message.repository";
import { GroupRepository } from "../repository/implements/group.repository";
import { ConversationRepository } from "../repository/implements/conversation.repository";
import { ConversationService } from "../services/implements/conversation.service";
import { OtpRepository } from "../repository/implements/otp.repository";
import { UserRepository } from "../repository/implements/user.repository";
import { OTPServices } from "../services/implements/otp.service";
import { UserService } from "../services/implements/user.service";
import { NotificationService } from "../services/implements/notification.service";
import { NotificationRepository } from "../repository/implements/notification.repository";
import { ChallengeProgressRepository } from "../repository/implements/progress.repository";

export class AppContainer {
  static messageService = new MessageService(new MessageRepository());

  static groupService = new GroupService(
    new GroupRepository(),
    new ConversationRepository()
  );

  static conversationService = new ConversationService(
    new ConversationRepository(),
    new GroupRepository(),
    new UserRepository()
  );

  static userService = new UserService(
    new UserRepository(),
    new OTPServices(new OtpRepository()),
    new ChallengeProgressRepository()
  );

  static notificationService = new NotificationService(
    new NotificationRepository()
  );
}