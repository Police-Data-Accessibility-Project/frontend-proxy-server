import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errors';

describe('errorHandler middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  let error: Error;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      statusCode: 500
    };
    nextFunction = jest.fn();
    error = new Error('Test error message');
  });

  it('should pass error to next() if headers are already sent', () => {
    mockResponse.headersSent = true;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalledWith(error);
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should return generic error message in production environment', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Internal Server Error'
      }
    });
    
    process.env.NODE_ENV = originalEnv;
  });

  it('should return actual error message in non-production environment', () => {
    process.env.NODE_ENV = 'development';
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error message'
      }
    });
  });

  it('should use existing status code if set', () => {
    mockResponse.statusCode = 400;
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error message'
      }
    });
  });
});
