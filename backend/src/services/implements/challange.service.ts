import {
  IChallengeService,
  SubmitPayload,
} from "../interfaces/challange.service.interface";
import { ChallengeDomainIF, ChallengeType } from "../../types/challenge.types";
import { Types } from "mongoose";
import { ChallengeRepository } from "../../repository/implements/challange.repository";
import { LevelRepository } from "../../repository/implements/level.repository";
import { UserRepository } from "../../repository/implements/user.repository";
import { ChallengeProgressRepository } from "../../repository/implements/progress.repository";
import { runInWorkerThread } from "../../worker/run.worker";
import { generateExecutableCode } from "../../utils/generate.executable.code";
import { sleep } from "../../utils/sleep.helper";
import { isEqual } from "../../utils/compare.helper";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs,
} from "../../mappers/challenge.dto";

export class ChallengeService implements IChallengeService {
  private challengeRepository: ChallengeRepository;
  private levelRepository: LevelRepository;
  private userRepository: UserRepository;
  private challengeProgressRepository: ChallengeProgressRepository;

  constructor(
    challengeRepository: ChallengeRepository,
    levelRepository: LevelRepository,
    userRepository: UserRepository,
    challengeProgressRepository: ChallengeProgressRepository
  ) {
    this.challengeRepository = challengeRepository;
    this.levelRepository = levelRepository;
    this.userRepository = userRepository;
    this.challengeProgressRepository = challengeProgressRepository;
  }

  async createChallenge(
    challengeData: Omit<ChallengeDomainIF, "_id">
  ): Promise<PublicChallengeDTO> {
    const challenge = await this.challengeRepository.createChallenge(
      challengeData
    );
    return toPublicChallengeDTO(challenge);
  }

  async getChallengeById(id: string, userId?: string): Promise<any> {
    const challenge = await this.challengeRepository.getChallengeById(id);
    if (!challenge) return null;

    let recentSubmission: any = null;
    let submisionHistory: any = [];
    let updatedInitialCode: any = challenge.initialCode;

    let totalAttempts = 0;
    let completedUsers = 0;
    let successRate = 0;

    const allProgress =
      await this.challengeProgressRepository.getAllProgressByChallenge(id);
    totalAttempts = allProgress.length;
    completedUsers = allProgress.filter((p) => p.status === "completed").length;
    successRate =
      totalAttempts > 0
        ? Math.round((completedUsers / totalAttempts) * 100)
        : 0;

    const testcases = challenge.testCases
      .filter((t) => t.isHidden !== true)
      .slice(0, 3);

    if (userId) {
      recentSubmission =
        await this.challengeProgressRepository.getLatestSubmissionByUserAndChallenge(
          userId,
          id
        );
      submisionHistory =
        await this.challengeProgressRepository.getAllSubmissionsByUserAndChallenge(
          userId,
          id
        );
    }

    return {
      ...toPublicChallengeDTO(challenge),
      testCases: testcases,
      initialCode: updatedInitialCode,
      recentSubmission,
      submisionHistory,
      completedUsers,
      successRate,
    };
  }

  async getChallenges(
    filter: any,
    userId: string
  ): Promise<{
    challenges: PublicChallengeDTO[];
    popularChallange: PublicChallengeDTO | null;
  }> {
    let query: any = {};

    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.isPremium) {
      query.isPremium = filter.isPremium;
    }
    if (filter.level) {
      query.level = filter.level;
    }
    if (filter.tags) {
      query.tags = { $in: filter.tags };
    }
    if (filter.searchQuery) {
      query.title = { $regex: filter.searchQuery, $options: "i" };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const popularChallangeId =
      await this.challengeProgressRepository.getMostCompletedChallengeOfWeek(
        oneWeekAgo
      );

    let popularChallange = await this.challengeRepository.getChallengeById(
      popularChallangeId as string
    );

    if (!userId)
      return {
        challenges: [],
        popularChallange: toPublicChallengeDTO(
          popularChallange as ChallengeDomainIF
        ),
      };

    const challenges = await this.challengeRepository.getChallenges(query);

    const progressList =
      await this.challengeProgressRepository.getAllProgress();
    const userProgressList =
      await this.challengeProgressRepository.getAllProgressByUser(userId);

    const userProgressMap = new Map();
    userProgressList.forEach((p) =>
      userProgressMap.set(p.challengeId.toString(), p)
    );

    const challengeProgressMap = new Map<
      string,
      { total: number; completed: number }
    >();
    for (const p of progressList) {
      const id = p.challengeId._id.toString();
      if (!challengeProgressMap.has(id)) {
        challengeProgressMap.set(id, { total: 0, completed: 0 });
      }
      const stats = challengeProgressMap.get(id)!;
      stats.total += 1;
      if (p.status === "completed") stats.completed += 1;
    }

    const challengesData = challenges.map((challenge) => {
      const challengeId = challenge._id ? challenge._id.toString() : "";
      const progress = userProgressMap.get(challengeId);
      if (!progress) return challenge;
      let userStatus = "not attempted";
      if (progress) userStatus = progress.status;

      const stats = challengeProgressMap.get(challengeId);
      const totalAttempts = stats?.total || 0;
      const completedUsers = stats?.completed || 0;
      const successRate =
        totalAttempts > 0
          ? Math.round((completedUsers / totalAttempts) * 100)
          : 0;

      return {
        ...toPublicChallengeDTO(challenge),
        userStatus,
        completedUsers,
        successRate,
      };
    });

    if (popularChallange) {
      const popId = popularChallange._id ? popularChallange._id.toString() : "";
      const progress = userProgressMap.get(popId);
      let userStatus = "not attempted";
      if (progress) userStatus = progress.status;

      const stats = challengeProgressMap.get(popId);
      const totalAttempts = stats?.total || 0;
      const completedUsers = stats?.completed || 0;
      const successRate =
        totalAttempts > 0
          ? Math.round((completedUsers / totalAttempts) * 100)
          : 0;

      popularChallange = {
        ...popularChallange.toObject(),
        userStatus,
        completedUsers,
        successRate,
      };
    }

    return {
      challenges: challengesData as PublicChallengeDTO[],
      popularChallange: popularChallange as PublicChallengeDTO,
    };
  }

  async getAllChallenges(
    search: string,
    page: number,
    limit: number
  ): Promise<{ challenges: PublicChallengeDTO[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const challenges = await this.challengeRepository.getAllChallenges(
      search,
      skip,
      limit
    );
    const totalItems = await this.challengeRepository.countAllChallenges(
      search
    );
    return { challenges: toPublicChallengeDTOs(challenges), totalItems };
  }

  async updateChallenge(
    id: Types.ObjectId,
    updateData: Partial<ChallengeDomainIF>
  ): Promise<PublicChallengeDTO | null> {
    const challenge = await this.challengeRepository.updateChallenge(
      id,
      updateData
    );
    return toPublicChallengeDTO(challenge as ChallengeDomainIF);
  }

  async deleteChallenge(id: Types.ObjectId): Promise<boolean> {
    return await this.challengeRepository.deleteChallenge(id);
  }

  async getChallengesByStatus(
    status: "active" | "inactive" | "draft" | "archived"
  ): Promise<PublicChallengeDTO[]> {
    const challenges = await this.challengeRepository.getChallengesByStatus(
      status
    );
    return toPublicChallengeDTOs(challenges);
  }

  async getChallengesByTags(tags: string[]): Promise<PublicChallengeDTO[]> {
    const challenges = await this.challengeRepository.getChallengesByTags(tags);
    return toPublicChallengeDTOs(challenges);
  }

  async findChallengeById(id: string): Promise<ChallengeDomainIF | null> {
    return await this.challengeRepository.getChallengeById(id);
  }

  async getChallengesByDifficulty(
    difficulty: "novice" | "adept" | "master"
  ): Promise<PublicChallengeDTO[]> {
    const challenges = await this.challengeRepository.getChallengesByDifficulty(
      difficulty
    );
    return toPublicChallengeDTOs(challenges);
  }

  async runChallengeCode(
    challengeId: string,
    language: string,
    sourceCode: string,
    input: string,
    userId: string
  ): Promise<any> {
    console.log({ challengeId, language, sourceCode, input, userId });

    const challenge = await this.challengeRepository.getChallengeById(
      challengeId
    );

    if (!challenge || challenge.type !== "code") {
      throw new Error("Only for code type");
    }

    if (!challenge.functionSignature) {
      throw new Error("Function signature missing in challenge");
    }

    const testCases = challenge.testCases.slice(0, 3);

    const results: any = [];

    for (let i = 0; i < testCases.length; i++) {
      await sleep(i * 300);

      const testCase: any = testCases[i];

      const funcName = challenge.functionSignature?.split("(")[0];

      const fullSource = generateExecutableCode(
        language,
        sourceCode,
        funcName,
        testCase.input
      );

      const executionResult = await runInWorkerThread(
        language,
        fullSource,
        input
      );

      const expectedOutput = String(testCase.output).trim();
      const userOutput = executionResult.run.stdout.trim();

      const passedTest = isEqual(expectedOutput, userOutput);

      results.push({
        input: testCase.input,
        name: testCase.isHidden ? `Hidden Test ${i + 1}` : `Test ${i + 1}`,
        expectedOutput: testCase.isHidden ? "[hidden]" : expectedOutput,
        actualOutput: testCase.isHidden
          ? passedTest
            ? "[matches]"
            : "[doesn't match]"
          : userOutput,
        passed: passedTest,
      });
    }

    return {
      userId,
      challengeId,
      language,
      results,
    };
  }

  async submitChallange(data: SubmitPayload, userId: string): Promise<any> {
    const { challengeId, userCode, language } = data;

    console.log("Data", data);
    const challenge = await this.challengeRepository.getChallengeById(
      challengeId
    );
    if (!challenge) throw new Error("Challenge not found");

    let testResults: any[] = [];
    let passed = false;

    const compare = (a: any, b: any) =>
      JSON.stringify(a).trim().toLowerCase() ===
      JSON.stringify(b).trim().toLowerCase();

    switch (challenge.type as ChallengeType) {
      case "code":
        if (!challenge.functionSignature) {
          throw new Error("Function signature missing");
        }

        for (let index = 0; index < challenge.testCases.length; index++) {
          const testCase = challenge.testCases[index];
          const funcName = challenge.functionSignature?.split("(")[0];
          const fullSource = generateExecutableCode(
            language,
            userCode as string,
            funcName,
            testCase.input
          );

          const executionResult = await runInWorkerThread(
            language,
            fullSource,
            ""
          );

          const expectedOutput = String(testCase.output).trim();
          const userOutput = (executionResult.run?.stdout || "").trim();
          const passedTest = isEqual(expectedOutput, userOutput);

          testResults.push({
            name: testCase.isHidden
              ? `Hidden Test ${index + 1}`
              : `Test ${index + 1}`,
            input: testCase.input,
            passed: passedTest,
            expectedOutput: testCase.isHidden ? "[hidden]" : expectedOutput,
            actualOutput: testCase.isHidden
              ? passedTest
                ? "[matches]"
                : "[doesn't match]"
              : userOutput,
          });

          await sleep(200);
        }

        passed = testResults.every((r) => r.passed === true);
        break;

      case "cipher":
        passed = compare(userCode, challenge.solutionCode);
        testResults = [
          {
            id: 1,
            name: "Decryption Match",
            status: passed ? "passed" : "failed",
            expected: challenge.solutionCode,
            actual: userCode,
          },
        ];
        console.log("PASSED", passed);
        break;

      default:
        throw new Error("Unsupported challenge type");
    }
    const user = await this.userRepository.getUserById(userId as string);

    if (!user) throw new Error("User not found");

    const earnedXP = challenge.xpRewards || 0;

    let currentXP = user.stats.xpPoints || 0;
    let currentLevel = user.stats.level || 1;

    let newXP = currentXP + earnedXP;
    let newLevel = currentLevel;
    if (passed) {
      user.stats.totalXpPoints = (user.stats.totalXpPoints || 0) + earnedXP;
      while (true) {
        const nextLevel = await this.levelRepository.getLevelByLevel(
          newLevel + 1
        );
        if (!nextLevel || newXP < nextLevel.requiredXP) break;

        newXP -= nextLevel.requiredXP;
        newLevel = nextLevel.levelNumber;
      }

      user.stats.xpPoints = newXP;
      user.stats.level = newLevel;

      await this.userRepository.save(user);
    }

    const challengeTimeLimitSeconds = challenge.timeLimit * 60;
    const timeTakenSeconds = challengeTimeLimitSeconds - data.finishTime;
    let status;

    if (passed) {
      status = "completed";
    } else if (!passed && data.isTimeLimitedSubmission) {
      status = "failed-timeout";
    } else if (!passed && !data.isTimeLimitedSubmission) {
      status = "failed-output";
    }


    console.log("Test Results:::_: ", testResults);

    const progressData: any = {
      challengeId: challenge._id,
      userId: user._id,
      passed,
      xpGained: passed ? earnedXP : 0,
      timeTaken: timeTakenSeconds,
      level: challenge.level,
      type: challenge.type,
      tags: challenge.tags || [],
      submittedAt: new Date(),
      status: status,
      execution: {
        language: data.language,
        codeSubmitted: userCode,
        resultOutput: testResults,
        testCasesPassed: testResults.filter((r) => r.passed === true)
          .length,
        totalTestCases: testResults.length,
      },
    };

    await this.challengeProgressRepository.createProgress(progressData);

    if (passed) {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const lastSolvedDate = new Date(user.stats.lastSolvedDate).toDateString();

      let currentStreak = user.stats.currentStreak || 0;
      let longestStreak = user.stats.longestStreak || 0;

      if (lastSolvedDate === today) {
      } else if (lastSolvedDate === yesterday) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      user.stats.lastSolvedDate = new Date();
      user.stats.currentStreak = currentStreak;
      user.stats.longestStreak = longestStreak;

      await this.userRepository.save(user);
    }

    const resData: any = {
      passed,
      testResults,
      xpGained: earnedXP,
      remainingXP: newXP,
    };

    if (newLevel > currentLevel) {
      resData.newLevel = newLevel;
    }

    return resData;
  }
}
