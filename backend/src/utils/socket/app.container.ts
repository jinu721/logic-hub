import { container } from "../../di/container";

export class AppContainer {
  static messageService = container.messageSvc;

  static groupService = container.groupSvc;

  static conversationService = container.conversationSvc;

  static userService = container.userSvc;

  static notificationService = container.notifySvc;
}