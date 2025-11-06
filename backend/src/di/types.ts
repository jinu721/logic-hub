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

  authCtrl: IAuthController;
  userCtrl: IUserController;
  avatarCtrl: InventoryController;
  bannerCtrl: InventoryController;
  badgeCtrl: InventoryController;
  challengeCtrl: IChallengeController;
  submissionCtrl: ISubmissionController;
  solutionCtrl: ISolutionController;
}
