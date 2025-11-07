import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({
    all: false,
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      verbose: 'cyan',
      debug: 'blue',
    },
  }),
  winston.format.printf(
    ({ timestamp, level, message, context, trace, stack }) => {
      // Color cyan para el contexto
      const contextStr = context ? `\x1b[36m[${context}]\x1b[0m` : '';
      // Color gris para traces
      const traceStr = trace ? `\n\x1b[90m${trace}\x1b[0m` : '';
      // Color rojo para stack traces
      const stackStr = stack ? `\n\x1b[31m${stack}\x1b[0m` : '';
      return `${timestamp} ${level} ${contextStr} ${message}${traceStr}${stackStr}`;
    },
  ),
);

const fileRotateTransport = new (winston.transports as any).DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

export const winstonConfig: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    fileRotateTransport,
  ],
  exceptionHandlers: [],
  rejectionHandlers: [],
};
