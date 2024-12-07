import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { v4 as uuid } from 'uuid';
import { AxiosError } from 'axios';
import fs from 'fs';
import path from 'path';

export type LoggedRequest = Request & {
  id: string;
};

interface HttpError extends Error {
  status?: number;
}

enum REQUEST_LOG_TYPE {
  REQUEST_START = 'REQUEST_START',
  REQUEST_END = 'REQUEST_END',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

const logDir = path.join(process.cwd(), '.logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Add custom colors (optional)
winston.addColors({
  info: 'cyan',
  ok: 'green',
  error: 'red',
  warn: 'yellow',
});

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
    error: 0,
    warn: 1,
    ok: 2,
    info: 3,
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
      format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        alignColorsAndTime
      ),
    }),
  ],
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Add request ID for tracking requests across logs
  const requestId = uuid();

  if (!(req as LoggedRequest).id) {
    (req as LoggedRequest).id = requestId;
  }

  // Log at start of request
  logger.info({
    type: REQUEST_LOG_TYPE.REQUEST_START,
    requestId: (req as LoggedRequest).id,
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
    if (res.statusCode < 400) {
      logger.log({
        level: 'ok',
        message: `Request ${(req as LoggedRequest)?.id} to ${req.originalUrl} successful`,

        type: REQUEST_LOG_TYPE.SUCCESS,
        requestId: (req as LoggedRequest).id,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        query: req.query,
        body: req.body,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString(),
      });
    }

    logger.info({
      type: REQUEST_LOG_TYPE.REQUEST_END,
      requestId: (req as LoggedRequest).id,
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
  error: HttpError | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default status code if not set
  const statusCode = error.status ?? 500;

  // Ensure status is set before logging
  res.status(statusCode);

  try {
    logger.error({
      type: REQUEST_LOG_TYPE.ERROR,
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

export const addRequestId = (req: Request, _res: Response, next: NextFunction) => {
  (req as LoggedRequest).id = uuid();
  next();
};
