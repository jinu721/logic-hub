import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { axiosInstance } from "@/services/apiServices";
import { getHeatMap } from "@/services/client/clientServices";

interface SubmissionData {
  date: string;
  count: number;
  level: number;
}

interface SubmissionHeatmapProps {
  username: string;
}

const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  username,
}) => {
  const [submissionData, setSubmissionData] = useState<SubmissionData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (!username) return;

    console.log("Started fetching data");

    const fetchData = async () => {
      try {

        const res = await getHeatMap(username, selectedYear.toString());

        const dataFromServer: { [date: string]: number } = res.data;
        const formattedData: SubmissionData[] = [];
        let total = 0;
        let current = 0;
        let longest = 0;
        let tempStreak = 0;

        const startDate = new Date(`${selectedYear}-01-01`);
        const endDate = new Date(`${selectedYear}-12-31`);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split("T")[0];
          const count = dataFromServer[dateStr] || 0;
          let level = 0;

          if (count > 0) {
            if (count <= 2) level = 1;
            else if (count <= 4) level = 2;
            else if (count <= 6) level = 3;
            else level = 4;
          }

          formattedData.push({ date: dateStr, count, level });
          total += count;

          if (count > 0) {
            tempStreak++;
            longest = Math.max(longest, tempStreak);
          } else {
            tempStreak = 0;
          }
        }

        for (let i = formattedData.length - 1; i >= 0; i--) {
          if (formattedData[i].count > 0) current++;
          else break;
        }

        setSubmissionData(formattedData);
        setTotalSubmissions(total);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchData();
  }, [selectedYear, username]);

  const getIntensityColor = (level: number) => {
    const colors = [
      "bg-gray-800", // 0 submissions
      "bg-violet-900/40", // 1-2
      "bg-violet-700/60", // 3-4
      "bg-violet-500/80", // 5-6
      "bg-violet-400",    // 7+
    ];
    return colors[level];
  };

  const getWeeksInYear = (year: number) => {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDay = new Date(startDate);
    const dayOfWeek = firstDay.getDay();
    if (dayOfWeek !== 0) firstDay.setDate(firstDay.getDate() - dayOfWeek);
    let currentDate = new Date(firstDay);

    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const submissionForDate = submissionData.find((s) => s.date === dateStr);
        week.push({
          date: new Date(currentDate),
          dateStr,
          submission: submissionForDate || { date: dateStr, count: 0, level: 0 },
          isCurrentYear: currentDate.getFullYear() === year,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const weeks = getWeeksInYear(selectedYear);
  const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 `}>
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Submission Activity</h2>
          <p className="text-gray-400 text-sm">{totalSubmissions} submissions in {selectedYear}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md text-sm text-white"
          >
            {selectedYear}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm ${
                    selectedYear === year ? "bg-violet-600 text-white" : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-fit">
          <div className="flex mb-2 ml-12">
            {Array.from({ length: 12 }).map((_, month) => {
              const monthDate = new Date(selectedYear, month, 1);
              const startDate = new Date(selectedYear, 0, 1);
              const weekIndex = Math.floor(
                (monthDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
              );
              return (
                <div key={month} style={{ marginLeft: `${weekIndex * 16}px` }} className="text-xs text-gray-400">
                  {months[month]}
                </div>
              );
            })}
          </div>

          <div className="flex">
            <div className="flex flex-col text-xs text-gray-400 pr-4 w-8">
              {weekdays.map((day, index) => (
                <span key={day} className={index % 2 === 0 ? "" : "opacity-0"}>
                  {day}
                </span>
              ))}
            </div>

            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
              {weeks.map((week, weekIdx) =>
                week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className={`w-4 h-4 rounded-sm border border-gray-600 cursor-pointer transition-all duration-200 hover:scale-110 ${
                      day.isCurrentYear ? getIntensityColor(day.submission.level) : "bg-gray-900"
                    }`}
                    title={`${formatDate(day.date)}: ${day.submission.count} submissions`}
                    onMouseEnter={() => setHoveredCell({ date: day.dateStr, count: day.submission.count })}
                    onMouseLeave={() => setHoveredCell(null)}
                  ></div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {hoveredCell && (
        <div className="mt-4 px-4 py-2 bg-gray-900 rounded-md border border-gray-700 text-white text-sm">
          <div className="font-medium">{hoveredCell.count} submission(s)</div>
          <div className="text-gray-400">{hoveredCell.date}</div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHeatmap;
