import { createLogger, format, transports } from "winston";

const { combine, timestamp, errors, printf, colorize } = format;

const blockFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  let logLines = [
    "==================== LOG START ====================",
    `🕒 Time   : ${timestamp}`,
    `🔖 Level  : ${level.toUpperCase()}`,
    `💬 Message: ${message}`,
  ];

  if (stack) {
    logLines.push(`🧾 Stack  :\n${stack}`);
  }

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

    new transports.File({
      filename: "logs/error.log",
      level: "error",
      format: combine(timestamp(), errors({ stack: true }), blockFormat),
    }),
    new transports.File({
      filename: "logs/combined.log",
      format: combine(timestamp(), errors({ stack: true }), blockFormat),
    }),
  ],
});

export default logger;
