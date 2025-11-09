import {
  ITokenProvider,
  IHashProvider,
  IEmailProvider,
  IImageUploader,
} from "@providers";

import {
  IUserRepository,
  IUserCommandService,
  IUserQueryService,
  IUserEngagementService,
  IUserController,
  IPendingUserRepository,
  IAuthController,
  IAuthService,
} from "@modules/user";

import {
  IAvatarRepository,
  IBannerRepository,
  IBadgeRepository,
  InventoryController,
  InventoryService,
} from "@modules/inventory";

import { ITokenRepository, ITokenService } from "@modules/token";

import {
  IChallengeRepository,
  ISolutionRepository,
  ISubmissionRepository,
  IChallengeCommandService,
  IChallengeQueryService,
  IChallengeExecutionService,
  IChallengeStatsService,
  ISubmissionService,
  ISolutionService,
  IChallengeController,
  ISubmissionController,
  ISolutionController,
} from "@modules/challenge";


import {
  IConversationRepository,
  IMessageRepository,
  IGroupRepository,
  IConversationCommandService,
  IConversationQueryService,
  IConversationTypingService,
  IMessageCommandService,
  IMessageQueryService,
  IMessageEngagementService,
  IGroupCommandService,
  IGroupQueryService,
  IGroupMemberService,
  IConversationController,
  IMessageController,
  IGroupController,
} from "@modules/chat";

import {
  ILevelRepository,
  ILevelService,
  ILevelController
} from "@modules/level";

import {
  IReportRepository,
  IReportService,
  IReportController
} from "@modules/report";

import {
  IMarketRepository,
  IMarketService,
  IMarketController
} from "@modules/market";

import {
  INotificationRepository,
  INotificationService,
  INotificationController
} from "@modules/notification";

import {
  IMembershipRepository,
  IMembershipService,
  IMembershipController
} from "@modules/membership";

import {
  IPurchaseRepository,
  IPurchaseCommandService,
  IPurchaseQueryService,
  IPurchasePaymentService,
  IPurchaseController
} from "@modules/purchase";

import {
  IAnalyticsRepository,
  IAnalyticsService,
  IAnalyticsController,
  ILeaderboardRepository
} from "@modules/analytics";

export interface Container {
  tokenProv: ITokenProvider;
  hashProv: IHashProvider;
  emailProv: IEmailProvider;
  imageUploader: IImageUploader;

  userRepo: IUserRepository;
  pendingUserRepo: IPendingUserRepository;
  tokenRepo: ITokenRepository;
  avatarRepo: IAvatarRepository;
  bannerRepo: IBannerRepository;
  badgeRepo: IBadgeRepository;
  challengeRepo: IChallengeRepository;
  submissionRepo: ISubmissionRepository;
  solutionRepo: ISolutionRepository;
  conversationRepo: IConversationRepository;
  messageRepo: IMessageRepository;
  groupRepo: IGroupRepository;
  levelRepo: ILevelRepository;
  reportRepo: IReportRepository;
  marketRepo: IMarketRepository;
  notificationRepo: INotificationRepository;
  membershipRepo: IMembershipRepository;
  purchaseRepo: IPurchaseRepository;
  analyticsRepo: IAnalyticsRepository;
  leaderboardRepo: ILeaderboardRepository;

  authSrv: IAuthService;
  userCommandSvc: IUserCommandService;
  userQuerySvc: IUserQueryService;
  userEngagementSvc: IUserEngagementService;
  tokenSvc: ITokenService;
  challengeCommandSvc: IChallengeCommandService;
  challengeQuerySvc: IChallengeQueryService;
  challengeExecutionSvc: IChallengeExecutionService;
  challengeStatsSvc: IChallengeStatsService;
  submissionSvc: ISubmissionService;
  solutionSvc: ISolutionService;
  avatarInventorySvc: InventoryService;
  bannerInventorySvc: InventoryService;
  badgeInventorySvc: InventoryService;
  conversationCommandSvc: IConversationCommandService;
  conversationQuerySvc: IConversationQueryService;
  conversationTypingSvc: IConversationTypingService;
  messageCommandSvc: IMessageCommandService;
  messageQuerySvc: IMessageQueryService;
  messageEngagementSvc: IMessageEngagementService;
  groupCommandSvc: IGroupCommandService;
  groupQuerySvc: IGroupQueryService;
  groupMemberSvc: IGroupMemberService;
  levelSvc: ILevelService;
  reportSvc: IReportService;
  marketSvc: IMarketService;
  notificationSvc: INotificationService;
  membershipSvc: IMembershipService;
  purchaseCommandSvc: IPurchaseCommandService;
  purchaseQuerySvc: IPurchaseQueryService;
  purchasePaymentSvc: IPurchasePaymentService;
  analyticsSvc: IAnalyticsService;

  authCtrl: IAuthController;
  userCtrl: IUserController;
  avatarCtrl: InventoryController;
  bannerCtrl: InventoryController;
  badgeCtrl: InventoryController;
  challengeCtrl: IChallengeController;
  submissionCtrl: ISubmissionController;
  solutionCtrl: ISolutionController;
  conversationCtrl: IConversationController;
  messageCtrl: IMessageController;
  groupCtrl: IGroupController;
  levelCtrl: ILevelController;
  reportCtrl: IReportController;
  marketCtrl: IMarketController;
  notificationCtrl: INotificationController;
  membershipCtrl: IMembershipController;
  purchaseCtrl: IPurchaseController;
  analyticsCtrl: IAnalyticsController;
}
