import { Request, Response, NextFunction } from 'express';
import express from 'express';
import supertest from 'supertest';
import winston from 'winston';
import { requestLogger, errorLogger, logger, LoggedRequest } from './logger';

// Mock winston logger
jest.mock('winston', () => ({
  format: {
    colorize: jest.fn().mockReturnThis(),
    label: jest.fn().mockReturnThis(),
    timestamp: jest.fn().mockReturnThis(),
    printf: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    combine: jest.fn().mockReturnThis(),
  },
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  }),
  addColors: jest.fn(),
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
  },
}));

// Mock the alignColorsAndTime format
const mockAlignColorsAndTime = {
  transform: jest.fn().mockReturnValue({
    level: 'info',
    message: 'test message',
    timestamp: '2023-01-01 00:00:00',
    label: '[INFO]'
  })
};

jest.spyOn(winston.format, 'combine').mockImplementation(() => mockAlignColorsAndTime);


describe('Logging Middleware', () => {
  let app: express.Application;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create Express app
    app = express();

    // Setup basic mocks
    mockReq = {
      method: 'GET',
      path: '/test',
      originalUrl: '/test',
      query: {},
      body: {},
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
    };

    mockRes = {
      on: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('requestLogger', () => {
    it('should add request ID and log request start', () => {
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      expect((mockReq as LoggedRequest).id).toBeDefined();
      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'REQUEST_START',
          method: 'GET',
          path: '/test',
        })
      );
      expect(mockNext).toHaveBeenCalled();
    });

    it('should log successful requests', () => {
      mockRes.statusCode = 200;
      
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      // Get the 'finish' callback
      const finishCallback = (mockRes.on as jest.Mock).mock.calls[0][1];
      finishCallback();

      expect(logger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'ok',
          type: 'SUCCESS',
        })
      );
    });

    it('should not log success for error status codes', () => {
      mockRes.statusCode = 404;
      
      requestLogger(mockReq as Request, mockRes as Response, mockNext);

      const finishCallback = (mockRes.on as jest.Mock).mock.calls[0][1];
      finishCallback();

      expect(logger.log).not.toHaveBeenCalled();
    });
  });

  describe('errorLogger', () => {
    it('should log errors with default 500 status', () => {
      const error = new Error('Test error');
      
      errorLogger(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ERROR',
          error: expect.objectContaining({
            message: 'Test error',
          }),
        })
      );
    });

    it('should use provided status code', () => {
      const error = new Error('Test error') as any;
      error.status = 404;
      
      errorLogger(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it('should handle logging errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (logger.error as jest.Mock).mockImplementation(() => {
        throw new Error('Logging failed');
      });

      const error = new Error('Test error');
      
      errorLogger(
        error,
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
