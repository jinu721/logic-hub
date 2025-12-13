import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, errors, printf, colorize } = format;

const blockFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  let logLines = [
    "==================== LOG START ====================",
    `🕒 Time   : ${timestamp}`,
    `🔖 Level  : ${level.toUpperCase()}`,
    `💬 Message: ${message}`,
  ];

  if (stack) logLines.push(`🧾 Stack  :\n${stack}`);

  if (meta.error) {
    const err = meta.error;
    if (err instanceof Error) {
      logLines.push(`🧾 MetaErr: ${err.stack || err.message}`);
    } else {
      logLines.push(`🧾 MetaErr: ${JSON.stringify(err)}`);
    }
  }

  logLines.push("==================== LOG END ======================\n");
  return logLines.join("\n");
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), errors({ stack: true }), blockFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), errors({ stack: true }), blockFormat),
    }),

    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d",   
      zippedArchive: true,
      format: combine(timestamp(), errors({ stack: true }), blockFormat),
    }),

    new DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",  
      zippedArchive: true,
      format: combine(timestamp(), errors({ stack: true }), blockFormat),
    }),
  ],
});

export default logger;
