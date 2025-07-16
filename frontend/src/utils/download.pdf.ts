type UserData = {
  totalUsers: number;
  activeUsersToday: number;
  newUsersLast7Days: number;
};

type TypeDistribution = {
  name: string;
  count: number;
  percentage: number;
};

type LeaderboardUser = {
  rank: number;
  username: string;
  solvedCount: number;
  stats: {
    xpPoints: number;
    level: number;
    currentStreak: number;
  };
};

type DashboardData = {
  stats: {
    completionRate: number;
    typeDistribution: TypeDistribution[];
  };
  leaderboardData: LeaderboardUser[];
};

export const downloadPDF = (userData: UserData, dashboardData: DashboardData) => {
  const printWindow = window.open('', '_blank');

  if (!printWindow) {
    alert('Popup blocked! Please allow popups for this website.');
    return;
  }

  const htmlContent = `
    <html>
      <head>
        <title>Leaderboard Dashboard Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .leaderboard-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .leaderboard-table th, .leaderboard-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .leaderboard-table th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Leaderboard Dashboard Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Users</h3>
            <p>${userData.totalUsers}</p>
          </div>
          <div class="stat-card">
            <h3>Active Today</h3>
            <p>${userData.activeUsersToday}</p>
          </div>
          <div class="stat-card">
            <h3>New Users (7 days)</h3>
            <p>${userData.newUsersLast7Days}</p>
          </div>
          <div class="stat-card">
            <h3>Completion Rate</h3>
            <p>${dashboardData.stats.completionRate}%</p>
          </div>
        </div>

        <h2>Leaderboard</h2>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Solved</th>
              <th>XP Points</th>
              <th>Level</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            ${dashboardData.leaderboardData.map(user => `
              <tr>
                <td>${user.rank}</td>
                <td>${user.username}</td>
                <td>${user.solvedCount}</td>
                <td>${user.stats.xpPoints}</td>
                <td>${user.stats.level}</td>
                <td>${user.stats.currentStreak}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Challenge Type Distribution</h2>
        <ul>
          ${dashboardData.stats.typeDistribution.map(type => `
            <li>${type.name}: ${type.count} (${type.percentage}%)</li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};
