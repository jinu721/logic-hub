import {
  TokenProvider,
  HashProvider,
  EmailProvider,
  ImageUploader,
} from "@providers";

import {
  UserRepository,
  PendingUserRepository,
  UserCommandService,
  UserQueryService,
  UserEngagementService,
  UserController,
  AuthController,
  AuthService,
} from "@modules/user";

import {
  InventoryController,
  AvatarRepository,
  BannerRepository,
  BadgeRepository,
  InventoryService,
} from "@modules/inventory";

import {
  TokenRepository,
  TokenService,
} from "@modules/token";

import { 
  ChallengeRepository, 
  SubmissionRepository,
  SolutionRepository,
  ChallengeCommandService,
  ChallengeQueryService,  
  ChallengeExecutionService,
  ChallengeStatsService,
  SubmissionService,
  SolutionService,
  ChallengeController,
  SubmissionController,
  SolutionController,
} from "@modules/challenge";


import {
  ConversationRepository,
  MessageRepository,
  GroupRepository,
  ConversationCommandService,
  ConversationQueryService,
  ConversationTypingService,
  MessageCommandService,
  MessageQueryService,
  MessageEngagementService,
  GroupCommandService,
  GroupQueryService,
  GroupMemberService,
  ConversationController,
  MessageController,
  GroupController,
} from "@modules/chat";

import {
  LevelRepository,
  LevelService,
  LevelController
} from "@modules/level";

import {
  ReportRepository,
  ReportService,
  ReportController
} from "@modules/report";

import {
  NotificationRepository,
  NotificationService,
  NotificationController
} from "@modules/notification";

import {
  MarketRepository,
  MarketService,
  MarketController
} from "@modules/market";

import {
  MembershipRepository,
  MembershipService,
  MembershipController
} from "@modules/membership";

import {
  PurchaseRepository,
  PurchaseCommandService,
  PurchaseQueryService,
  PurchasePaymentService,
  PurchaseController
} from "@modules/purchase";

import {
  AnalyticsRepository,
  AnalyticsService,
  AnalyticsController,
} from "@modules/analytics";

import { Container } from "./types";
import { razorpay } from "@config/razorpay.config";
import { env } from "@config/env";

export const createContainer = () => {

  console.log("DI STARTED");

  const container = {} as Container;

  container.tokenProv = new TokenProvider();
  container.hashProv = new HashProvider();
  container.emailProv = new EmailProvider();
  container.imageUploader = new ImageUploader();

  container.userRepo = new UserRepository();
  container.pendingUserRepo = new PendingUserRepository();
  container.tokenRepo = new TokenRepository();
  container.avatarRepo = new AvatarRepository();
  container.bannerRepo = new BannerRepository();
  container.badgeRepo = new BadgeRepository();
  container.challengeRepo = new ChallengeRepository();
  container.submissionRepo = new SubmissionRepository();
  container.solutionRepo = new SolutionRepository();
  container.conversationRepo = new ConversationRepository();
  container.messageRepo = new MessageRepository();
  container.groupRepo = new GroupRepository();
  container.levelRepo = new LevelRepository();
  container.reportRepo = new ReportRepository();
  container.marketRepo = new MarketRepository();
  container.notificationRepo = new NotificationRepository();
  container.membershipRepo = new MembershipRepository();
  container.purchaseRepo = new PurchaseRepository();
  container.analyticsRepo = new AnalyticsRepository();

  container.tokenSvc = new TokenService(
    container.tokenRepo,
    container.tokenProv
  );
  container.authSrv = new AuthService(
    container.userRepo,
    container.pendingUserRepo,
    container.tokenProv,
    container.emailProv,
    container.hashProv,
    container.tokenSvc
  );
  container.userCommandSvc = new UserCommandService(
    container.userRepo,
    container.hashProv
  );
  container.userQuerySvc = new UserQueryService(container.userRepo);
  container.userEngagementSvc = new UserEngagementService(container.userRepo);
  container.avatarInventorySvc = new InventoryService(
    container.avatarRepo,
    container.imageUploader
  );
  container.bannerInventorySvc = new InventoryService(
    container.bannerRepo,
    container.imageUploader
  );
  container.badgeInventorySvc = new InventoryService(
    container.badgeRepo,
    container.imageUploader
  );
  container.challengeCommandSvc = new ChallengeCommandService(container.challengeRepo);
  container.challengeQuerySvc = new ChallengeQueryService(
    container.challengeRepo,
    container.submissionRepo
  );
  container.challengeExecutionSvc = new ChallengeExecutionService(
    container.challengeRepo,
    container.submissionRepo
  );
  container.challengeStatsSvc = new ChallengeStatsService(
    container.challengeRepo,
    container.submissionRepo,
    container.userRepo,
    container.levelRepo
  );
  container.submissionSvc = new SubmissionService(
    container.submissionRepo,
    container.userRepo
  );
  container.solutionSvc = new SolutionService(
    container.solutionRepo
  );
  container.conversationCommandSvc = new ConversationCommandService(
    container.conversationRepo,
  );
  container.conversationQuerySvc = new ConversationQueryService(
    container.conversationRepo,
    container.groupRepo,
    container.groupRepo
  );
  container.conversationTypingSvc = new ConversationTypingService(
    container.conversationRepo
  );
  container.messageCommandSvc = new MessageCommandService(
    container.messageRepo,
  );
  container.messageQuerySvc = new MessageQueryService(
    container.messageRepo,
  );
  container.messageEngagementSvc = new MessageEngagementService(
    container.messageRepo
  );
  container.groupCommandSvc = new GroupCommandService(
    container.groupRepo,
    container.conversationRepo,
  );
  container.groupQuerySvc = new GroupQueryService(
    container.groupRepo,
  );
  container.groupMemberSvc = new GroupMemberService(
    container.groupRepo,
    container.conversationRepo
  );
  container.levelSvc = new LevelService(
    container.levelRepo,
    container.userRepo
  );
  container.reportSvc = new ReportService(
    container.reportRepo,
  );
  container.marketSvc = new MarketService(
    container.marketRepo,
    container.userRepo
  );
  container.notificationSvc = new NotificationService(
    container.notificationRepo
  );
  container.membershipSvc = new MembershipService(
    container.membershipRepo
  );
  container.purchaseCommandSvc = new PurchaseCommandService(
    container.purchaseRepo,
    container.membershipRepo,
    container.userRepo
  );
  container.purchaseQuerySvc = new PurchaseQueryService(
    container.purchaseRepo,
  );
  container.purchasePaymentSvc = new PurchasePaymentService(
    razorpay,
    env.RAZORPAY_KEY_SECRET as string,
  );
  container.analyticsSvc = new AnalyticsService(
    container.analyticsRepo,
    container.leaderboardRepo
  );


  container.authCtrl = new AuthController(container.authSrv);
  container.userCtrl = new UserController(
    container.userQuerySvc,
    container.userCommandSvc,
    container.userEngagementSvc,
    container.tokenSvc
  );
  container.avatarCtrl = new InventoryController(container.avatarInventorySvc);
  container.bannerCtrl = new InventoryController(container.bannerInventorySvc);
  container.badgeCtrl = new InventoryController(container.badgeInventorySvc);
  container.challengeCtrl = new ChallengeController(
    container.challengeQuerySvc,
    container.challengeCommandSvc,
    container.challengeExecutionSvc,
    container.challengeStatsSvc
  );
  container.submissionCtrl = new SubmissionController(
    container.submissionSvc
  );
  container.solutionCtrl = new SolutionController(
    container.solutionSvc
  );
  container.conversationCtrl = new ConversationController(
    container.conversationCommandSvc,
    container.conversationQuerySvc,
    container.conversationTypingSvc
  );
  container.messageCtrl = new MessageController(
    container.messageQuerySvc,
    container.messageCommandSvc,
    container.messageEngagementSvc
  );
  container.groupCtrl = new GroupController(
    container.groupQuerySvc,
    container.groupCommandSvc,
    container.groupMemberSvc
  );
  container.levelCtrl = new LevelController(
    container.levelSvc
  );
  container.reportCtrl = new ReportController(
    container.reportSvc
  );
  container.marketCtrl = new MarketController(
    container.marketSvc
  );
  container.notificationCtrl = new NotificationController(
    container.notificationSvc
  );
  container.membershipCtrl = new MembershipController(
    container.membershipSvc
  );
  container.purchaseCtrl = new PurchaseController(
    container.purchasePaymentSvc,
    container.purchaseCommandSvc,
    container.purchaseQuerySvc
  );
  container.analyticsCtrl = new AnalyticsController(
    container.analyticsSvc
  );

  
  console.log("DI ENDED");


  return container;
};
