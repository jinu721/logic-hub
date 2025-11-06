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

import { Container } from "./types";

export const createContainer = () => {

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
    container.challengeRepo
  );
  container.solutionSvc = new SolutionService(
    container.solutionRepo,
    container.challengeRepo
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
    container.challengeCommandSvc,
    container.challengeQuerySvc,
    container.challengeExecutionSvc,
    container.challengeStatsSvc
  );
  container.submissionCtrl = new SubmissionController(
    container.submissionSvc
  );
  container.solutionCtrl = new SolutionController(
    container.solutionSvc
  );

  return container;
};
