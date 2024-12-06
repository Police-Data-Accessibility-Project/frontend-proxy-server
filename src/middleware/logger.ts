import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'axios';

export type LoggedRequest = Request & {
  id: string;
};

const alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),
  winston.format.label({
    label: '[LOGGER]',
  }),
  winston.format.timestamp({
    format: 'YY-MM-DD HH:mm:ss',
  }),
  winston.format.printf(
    (info) => `\n${info.label} ${info.timestamp} \n${info.level} : ${info.message}\n`
  )
);

export const logger = winston.createLogger({
  levels: {
    info: 0,
    ok: 1,
    error: 2,
  },
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // File transports don't need colors
    new winston.transports.File({
      filename: process.cwd() + '/.logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: process.cwd() + '/.logs/combined.log',
      level: 'info',
    }),
    // Console transport with colors
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
    }),

    // new winston.transports.Console({
    //   level: 'info',
    //   stderrLevels: ['error'],
    //   format: winston.format.combine(
    //     winston.format.timestamp(),
    //     winston.format.colorize({
    //       all: true,
    //       colors: {
    //         info: 'blue',
    //         ok: 'green',
    //         error: 'red',
    //       },
    //     }),
    //     winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    //       let msg = `${timestamp} ${level}: ${message}`;

    //       if (Object.keys(metadata).length > 0) {
    //         msg += '\n' + JSON.stringify(metadata, null, 2);
    //       }

    //       return msg;
    //     })
    //   ),
    // }),
  ],
});

// Add custom colors (optional)
winston.addColors({
  info: 'green',
  ok: 'green',
  error: 'red',
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID for tracking requests across logs
  const requestId = uuid();
  (req as LoggedRequest).id = requestId;

  // Log at start of request
  logger.info({
    type: 'REQUEST_START',
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  // Log when request completes or errors
  res.on('finish', () => {
    logger.info({
      type: 'REQUEST_END',
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

// Error logging middleware - place this last in your middleware chain
export const errorLogger = (
  error: Error | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code if not set
  // @ts-expect-error - a
  const statusCode = error.status ?? 500;

  // Ensure status is set before logging
  res.status(statusCode);

  try {
    logger.error({
      type: 'ERROR',
      requestId: (req as LoggedRequest).id,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
      },
      query: req.query,
      body: req.body,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    });
  } catch (loggingError) {
    console.error('Error while logging:', loggingError);
  }

  // Pass to error handler
  next(error);
};
