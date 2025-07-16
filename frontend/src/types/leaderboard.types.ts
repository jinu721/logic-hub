type LevelStat = {
  name: string;
  count: number;
  percentage: number;
};

type TypeStat = {
  name: string;
  count: number;
  percentage: number;
};

type DomainStat = {
  name: string;
  completions: number;
  percentage: number;
};

type DayActivity = {
  name: string;
  value: number;
};

type WeeklyActivity = {
  busiestDay: string;
  avgSubmissions: number;
  growth: number;
  days?: DayActivity[];
};

export type Stats = {
  totalSubmissions?: number;
  totalUsers?: number;
  completionRate?: number;
  levelDistribution?: LevelStat[];
  typeDistribution?: TypeStat[];
  domainStats?: DomainStat[];
  weeklyActivity?: WeeklyActivity;
};