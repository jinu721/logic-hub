import { MostPlayedChallengeDomain, ChallengeCompletionRateDomain, ChallengeAverageTimeDomain, ChallengeAttemptsSuccessDomain } from "@shared/types";

export interface ChallengeStatsDTO {
  mostPlayedRooms: MostPlayedChallengeDomain[];
  completionRates: ChallengeCompletionRateDomain[];
  averageCompletionTime: ChallengeAverageTimeDomain[];
  attemptsVsSuccess: ChallengeAttemptsSuccessDomain[];
}
