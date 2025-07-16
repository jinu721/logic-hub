import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getHeatMap } from "@/services/client/clientServices";

interface SubmissionData {
  date: string;
  count: number;
  level: number;
}

interface SubmissionHeatmapProps {
  userId: string;
  isCurrentUser: boolean;
}

interface TooltipData {
  date: string;
  count: number;
  x: number;
  y: number;
}

const SubmissionHeatmap: React.FC<SubmissionHeatmapProps> = ({
  userId,
  isCurrentUser,
}) => {
  const [submissionData, setSubmissionData] = useState<SubmissionData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHeatMap(userId, selectedYear);

        console.log("HEatMap Data", data);
        const formattedData: SubmissionData[] = [];
        let total = 0;

        const startDate = new Date(`${selectedYear}-01-01`);
        const endDate = new Date(`${selectedYear}-12-31`);

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          const dateStr = d.toISOString().split("T")[0];
          const count = data[dateStr] || 0;

          let level = 0;
          if (count > 0) {
            if (count <= 2) level = 1;
            else if (count <= 4) level = 2;
            else if (count <= 6) level = 3;
            else level = 4;
          }

          formattedData.push({ date: dateStr, count, level });
          total += count;
        }

        setSubmissionData(formattedData);
        setTotalSubmissions(total);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchData();
  }, [selectedYear, userId, isCurrentUser]);

  const getIntensityColor = (level: number) => {
    const colors = [
      "bg-gray-800/60",
      "bg-emerald-500/30",
      "bg-emerald-500/50",
      "bg-emerald-500/70",
      "bg-emerald-500/90",
    ];
    return colors[level];
  };

  const getWeeksInYear = (year: number) => {
    const weeks = [];

    const startDate = new Date(year, 0, 1);

    const firstSunday = new Date(startDate);
    const dayOfWeek = firstSunday.getDay();
    if (dayOfWeek !== 0) {
      firstSunday.setDate(firstSunday.getDate() - dayOfWeek);
    }

    const currentDate = new Date(firstSunday);

    for (let week = 0; week < 53; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const submissionForDate = submissionData.find(
          (s) => s.date === dateStr
        );
        const isCurrentYear = currentDate.getFullYear() === year;

        weekDays.push({
          date: new Date(currentDate),
          dateStr,
          submission: submissionForDate || {
            date: dateStr,
            count: 0,
            level: 0,
          },
          isCurrentYear,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(weekDays);
    }

    return weeks;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleMouseEnter = (day: any, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    // const viewportHeight = window.innerHeight;

    let x = rect.left + rect.width / 2;
    let y = rect.top;

    const tooltipWidth = 200;
    if (x + tooltipWidth / 2 > viewportWidth) {
      x = viewportWidth - tooltipWidth / 2 - 10;
    } else if (x - tooltipWidth / 2 < 0) {
      x = tooltipWidth / 2 + 10;
    }

    if (y < 80) {
      y = rect.bottom + 10;
    }

    setTooltip({
      date: day.dateStr,
      count: day.submission.count,
      x: x,
      y: y,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const weeks = getWeeksInYear(selectedYear);
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const getMonthPositions = () => {
    const monthPositions = [];
    const startOfYear = new Date(selectedYear, 0, 1);
    const startOfYearDay = startOfYear.getDay();

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(selectedYear, month, 1);
      const dayOfYear = Math.floor(
        (monthDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekIndex = Math.floor((dayOfYear + startOfYearDay) / 7);

      monthPositions.push({
        month,
        weekIndex,
        name: months[month],
      });
    }

    return monthPositions;
  };

  const monthPositions = getMonthPositions();

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-indigo-500/40 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex justify-between items-center p-6 pb-4">
        <div>
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 font-extrabold tracking-tight">
            {totalSubmissions} submissions in {selectedYear}
          </h2>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/70 border border-gray-600/50 rounded-lg text-sm text-gray-200 hover:bg-gray-600/70 transition-colors"
          >
            {selectedYear}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-xl z-10 min-w-[80px]">
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                  className={`block w-full px-3 py-1.5 text-left text-sm transition-colors ${
                    selectedYear === year
                      ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex mb-3 pl-12 relative h-4">
              {monthPositions.map((monthPos) => (
                <div
                  key={monthPos.month}
                  className="text-xs text-gray-400 absolute"
                  style={{ left: `${48 + monthPos.weekIndex * 15}px` }}
                >
                  {monthPos.name}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div
                className="flex flex-col text-xs text-gray-400 justify-between pt-1"
                style={{ height: "105px" }}
              >
                {weekdays.map((day, index) => (
                  <div
                    key={day}
                    className={`h-3 flex items-center ${
                      index % 2 === 0 ? "" : "opacity-0"
                    }`}
                  >
                    <span>{day}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-1">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1">
                    {week.map((day, dayIdx) => (
                      <div
                        key={`${weekIdx}-${dayIdx}`}
                        className={`w-3 h-3 rounded-sm border cursor-pointer transition-all duration-200 hover:scale-110 hover:border-emerald-400 ${
                          day.isCurrentYear
                            ? `${getIntensityColor(
                                day.submission.level
                              )} border-gray-600/50`
                            : "bg-gray-900/50 border-gray-700/50"
                        }`}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={handleMouseLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-start mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <span className="mr-2">Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm border border-gray-600/50 ${getIntensityColor(
                      level
                    )}`}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-[9999] px-3 py-2 bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 text-white text-sm rounded-lg shadow-lg pointer-events-none max-w-xs transition-opacity duration-150"
          style={{
            left: tooltip.x - 500,
            top: tooltip.y - 220,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-medium text-white">
            {tooltip.count} submission{tooltip.count !== 1 ? "s" : ""}
          </div>
          <div className="text-gray-300 text-xs">
            {formatDate(tooltip.date)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHeatmap;
