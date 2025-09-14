import {
  IChallengeService,
  SubmitPayload,
} from "../interfaces/challange.service.interface";
import { ChallengeDomainIF, ChallengeType } from "../../types/challenge.types";
import { Types } from "mongoose";
import { runInWorkerThread } from "../../worker/run.worker";
import { generateExecutableCode } from "../../utils/execution/generate.executable.code";
import { isEqual } from "../../utils/execution/compare.helper";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs,
} from "../../mappers/challenge.dto";
import { IChallengeRepository } from "../../repository/interfaces/challange.repository.interface";
import { ILevelRepository } from "../../repository/interfaces/level.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";
import { IChallengeProgressRepository } from "../../repository/interfaces/progress.repository.interface";

export class ChallengeService implements IChallengeService {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _levelRepo: ILevelRepository,
    private readonly _userRepo: IUserRepository,
    private readonly _progressRepo: IChallengeProgressRepository
  ) {}

  async createChallenge(
    challengeData: Omit<ChallengeDomainIF, "_id">
  ): Promise<PublicChallengeDTO> {
    const challenge = await this._challengeRepo.createChallenge(challengeData);
    return toPublicChallengeDTO(challenge);
  }

  async getChallengeById(id: string, userId?: string): Promise<any> {
    const challenge = await this._challengeRepo.getChallengeById(id);
    if (!challenge) return null;

    let recentSubmission: any = null;
    let submisionHistory: any = [];
    let updatedInitialCode: any = challenge.initialCode;

    let totalAttempts = 0;
    let completedUsers = 0;
    let successRate = 0;

    const allProgress = await this._progressRepo.getAllProgressByChallenge(id);
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
        await this._progressRepo.getLatestSubmissionByUserAndChallenge(
          userId,
          id
        );
      submisionHistory =
        await this._progressRepo.getAllSubmissionsByUserAndChallenge(
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
    totalItems: number;
  }> {
    let query: any = {};
    let limit = filter.limit || 10;
    let page = filter.page || 1;
    let skip = (page - 1) * limit || 0;

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
      await this._progressRepo.getMostCompletedChallengeOfWeek(oneWeekAgo);

    let popularChallange = await this._challengeRepo.getChallengeById(
      popularChallangeId as string
    );

    if (!userId)
      return {
        challenges: [],
        popularChallange: toPublicChallengeDTO(
          popularChallange as ChallengeDomainIF
        ),
        totalItems: 0,
      };

    const challenges = await this._challengeRepo.getChallenges(
      query,
      skip,
      limit
    );

    const totalItems = await this._challengeRepo.countAllChallenges("");

    const progressList = await this._progressRepo.getAllProgress();
    const userProgressList = await this._progressRepo.getAllProgressByUser(
      userId
    );

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
      totalItems,
    };
  }

  async getAllChallenges(
    search: string,
    page: number,
    limit: number
  ): Promise<{ challenges: PublicChallengeDTO[]; totalItems: number }> {
    const skip = (page - 1) * limit;
    const challenges = await this._challengeRepo.getAllChallenges(
      search,
      skip,
      limit
    );
    const totalItems = await this._challengeRepo.countAllChallenges(search);
    return { challenges: toPublicChallengeDTOs(challenges), totalItems };
  }

  async updateChallenge(
    id: Types.ObjectId,
    updateData: Partial<ChallengeDomainIF>
  ): Promise<PublicChallengeDTO | null> {
    const challenge = await this._challengeRepo.updateChallenge(id, updateData);
    return toPublicChallengeDTO(challenge as ChallengeDomainIF);
  }

  async deleteChallenge(id: Types.ObjectId): Promise<boolean> {
    return await this._challengeRepo.deleteChallenge(id);
  }

  async getChallengesByStatus(
    status: "active" | "inactive" | "draft" | "archived"
  ): Promise<PublicChallengeDTO[]> {
    const challenges = await this._challengeRepo.getChallengesByStatus(status);
    return toPublicChallengeDTOs(challenges);
  }

  async getChallengesByTags(tags: string[]): Promise<PublicChallengeDTO[]> {
    const challenges = await this._challengeRepo.getChallengesByTags(tags);
    return toPublicChallengeDTOs(challenges);
  }

  async findChallengeById(id: string): Promise<ChallengeDomainIF | null> {
    return await this._challengeRepo.getChallengeById(id);
  }

  async getChallengesByDifficulty(
    difficulty: "novice" | "adept" | "master"
  ): Promise<PublicChallengeDTO[]> {
    const challenges = await this._challengeRepo.getChallengesByDifficulty(
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
    try {
      console.log({ challengeId, language, sourceCode, input, userId });

      const challenge = await this._challengeRepo.getChallengeById(challengeId);

      if (!challenge) {
        throw new Error("Challenge not found");
      }

      if (challenge.type !== "code") {
        throw new Error("Only for code type");
      }

      if (!challenge.functionSignature) {
        throw new Error("Function signature missing in challenge");
      }

      if (!challenge.testCases || challenge.testCases.length === 0) {
        throw new Error("No test cases found for this challenge");
      }

      const testCases = challenge.testCases.slice(0, 3);
      const funcName = challenge.functionSignature?.split("(")[0];

      console.log("Function name extracted:", funcName);
      console.log("Test cases to run:", testCases);

      const fullSource = generateExecutableCode(
        language,
        sourceCode,
        funcName,
        testCases
      );

      console.log("Generated executable code:", fullSource);

      const executionResult = await runInWorkerThread(
        language,
        fullSource,
        input || ""
      );

      console.log("Execution result:", executionResult);

      let batchResults: any[] = [];

      try {
        const stdout = executionResult.run?.stdout || "";
        console.log("Raw stdout:", stdout);

        if (!stdout.trim()) {
          throw new Error("No output received from execution");
        }

        batchResults = JSON.parse(stdout.trim());
        console.log("Parsed batch results:", batchResults);
      } catch (parseError) {
        console.error("Failed to parse batch execution results:", parseError);
        console.error("Raw stdout was:", executionResult.run?.stdout);
        console.error("Stderr:", executionResult.run?.stderr);

        batchResults = testCases.map((_, index) => ({
          success: false,
          error: `Failed to execute test case ${index + 1}: ${
            parseError.message
          }`,
        }));
      }

      const results = testCases.map((testCase, index) => {
        const batchResult = batchResults[index] || {
          success: false,
          error: "No result available",
        };

        let passedTest = false;
        let userOutput = "";

        if (batchResult.success) {
          const expectedOutput = String(testCase.output).trim();
          userOutput = String(batchResult.result || "").trim();
          passedTest = isEqual(expectedOutput, userOutput);
        } else {
          userOutput = batchResult.error || "Execution failed";
        }

        return {
          input: testCase.input,
          name: testCase.isHidden
            ? `Hidden Test ${index + 1}`
            : `Test ${index + 1}`,
          expectedOutput: testCase.isHidden
            ? "[hidden]"
            : String(testCase.output).trim(),
          actualOutput: testCase.isHidden
            ? passedTest
              ? "[matches]"
              : "[doesn't match]"
            : userOutput,
          stdout: batchResult.logs || "",
          passed: passedTest,
        };
      });

      console.log("Final results:", results);

      return {
        userId,
        challengeId,
        language,
        results,
      };
    } catch (error) {
      console.error("Error in runChallengeCode:", error);
      throw error;
    }
  }

  async submitChallange(data: SubmitPayload, userId: string): Promise<any> {
    try {
      const { challengeId, userCode, language } = data;

      console.log("Submit challenge data:", data);

      const challenge = await this._challengeRepo.getChallengeById(challengeId);

      if (!challenge) {
        throw new Error("Challenge not found");
      }

      console.log("Challenge found:", challenge._id, challenge.type);

      if (!challenge.testCases || challenge.testCases.length === 0) {
        throw new Error("No test cases found for this challenge");
      }

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

          const funcName = challenge.functionSignature?.split("(")[0];
          console.log("Function name extracted:", funcName);

          // ✅ This is correct - passing the full testCases array for batch execution
          const fullSource = generateExecutableCode(
            language,
            userCode,
            funcName,
            challenge.testCases
          );

          console.log("Generated executable code length:", fullSource.length);

          const executionResult = await runInWorkerThread(
            language,
            fullSource,
            ""
          );

          console.log("Execution result:", executionResult);

          let batchResults: any[] = [];

          try {
            const stdout = executionResult.run?.stdout || "";
            console.log("Raw stdout:", stdout);

            if (!stdout.trim()) {
              throw new Error("No output received from execution");
            }

            batchResults = JSON.parse(stdout.trim());
            console.log("Parsed batch results length:", batchResults.length);
          } catch (parseError) {
            console.error(
              "Failed to parse batch execution results:",
              parseError
            );
            console.error("Raw stdout was:", executionResult.run?.stdout);
            console.error("Stderr:", executionResult.run?.stderr);

            batchResults = challenge.testCases.map((_, index) => ({
              success: false,
              error: `Failed to execute test case ${index + 1}: ${
                parseError.message
              }`,
            }));
          }

          testResults = challenge.testCases.map((testCase, index) => {
            const batchResult = batchResults[index] || {
              success: false,
              error: "No result available",
            };

            let passedTest = false;
            let userOutput = "";

            if (batchResult.success) {
              const expectedOutput = String(testCase.output).trim();
              userOutput = String(batchResult.result || "").trim();
              passedTest = isEqual(expectedOutput, userOutput);
            } else {
              userOutput = batchResult.error || "Execution failed";
            }

            return {
              name: testCase.isHidden
                ? `Hidden Test ${index + 1}`
                : `Test ${index + 1}`,
              input: testCase.input,
              passed: passedTest,
              expectedOutput: testCase.isHidden
                ? "[hidden]"
                : String(testCase.output).trim(),
              actualOutput: testCase.isHidden
                ? passedTest
                  ? "[matches]"
                  : "[doesn't match]"
                : userOutput,
            };
          });

          passed = testResults.every((r) => r.passed === true);
          console.log("All tests passed:", passed);
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
          console.log("Cipher challenge passed:", passed);
          break;

        default:
          throw new Error(`Unsupported challenge type: ${challenge.type}`);
      }

      const user = await this._userRepo.getUserById(userId as string);

      if (!user) {
        throw new Error("User not found");
      }

      console.log("User found:", user._id);

      const existingProgress = await this._progressRepo.findOne({
        challengeId: challenge._id,
        userId: user._id,
        passed: true,
      });

      const alreadyCompleted = !!existingProgress;
      console.log("Already completed:", alreadyCompleted);

      const earnedXP = challenge.xpRewards || 0;

      let currentXP = user.stats.xpPoints || 0;
      let currentLevel = user.stats.level || 1;

      let newXP = currentXP;
      let newLevel = currentLevel;

      if (passed && !alreadyCompleted) {
        user.stats.totalXpPoints = (user.stats.totalXpPoints || 0) + earnedXP;
        newXP = currentXP + earnedXP;

        while (true) {
          const nextLevel = await this._levelRepo.getLevelByLevel(newLevel + 1);
          if (!nextLevel || newXP < nextLevel.requiredXP) break;

          newXP -= nextLevel.requiredXP;
          newLevel = nextLevel.levelNumber;
        }

        user.stats.xpPoints = newXP;
        user.stats.level = newLevel;

        await this._userRepo.save(user);
        console.log("User stats updated");
      }

      // ✅ Add null check for finishTime
      const challengeTimeLimitSeconds = (challenge.timeLimit || 0) * 60;
      const timeTakenSeconds =
        challengeTimeLimitSeconds - (data.finishTime || 0);
      let status;

      if (passed) {
        status = "completed";
      } else if (!passed && data.isTimeLimitedSubmission) {
        status = "failed-timeout";
      } else if (!passed && !data.isTimeLimitedSubmission) {
        status = "failed-output";
      }

      console.log("Challenge status:", status);

      const progressData: any = {
        challengeId: challenge._id,
        userId: user._id,
        passed,
        xpGained: passed && !alreadyCompleted ? earnedXP : 0,
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
          testCasesPassed: testResults.filter((r) => r.passed === true).length,
          totalTestCases: testResults.length,
        },
      };

      await this._progressRepo.createProgress(progressData);
      console.log("Progress saved");

      if (passed && !alreadyCompleted) {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const lastSolvedDate = user.stats.lastSolvedDate
          ? new Date(user.stats.lastSolvedDate).toDateString()
          : "";

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

        await this._userRepo.save(user);
        console.log("Streak updated");
      }

      const resData: any = {
        passed,
        testResults,
        xpGained: passed && !alreadyCompleted ? earnedXP : 0,
        remainingXP: newXP,
      };

      if (newLevel > currentLevel) {
        resData.newLevel = newLevel;
      }

      console.log("Final response data:", resData);
      return resData;
    } catch (error) {
      console.error("Error in submitChallenge:", error);
      throw error;
    }
  }
}
