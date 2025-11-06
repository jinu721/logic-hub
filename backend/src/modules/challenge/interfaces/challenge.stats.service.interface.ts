export interface IChallengeStatsService {
  applySubmissionEffects(data: any, userId: string): Promise<any>;
  getPopularChallenge(): Promise<any>;
  getChallengeSuccessRate(challengeId: string): Promise<number>;
}
