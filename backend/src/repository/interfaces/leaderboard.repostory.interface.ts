
export interface ILeaderboardRepository {
  getLeaderboardData(matchConditions:any,sortField:any,sortOrder:any,page:number,limit:number): Promise<any>
  coutAllLeaderboardData(matchConditions:any): Promise<any>
  getStatistics(): Promise<any>
}
