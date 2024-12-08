import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequest } from './validate-request';

describe('validateRequest middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should pass validation when request body matches schema', () => {
    const schema = z.object({
      username: z.string(),
      age: z.number()
    });

    mockRequest.body = {
      username: 'testuser',
      age: 25
    };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should handle Zod validation errors', () => {
    const schema = z.object({
      username: z.string(),
      age: z.number()
    });

    mockRequest.body = {
      username: 'testuser',
      age: 'invalid' // This should trigger a Zod error
    };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    const error = nextFunction.mock.calls[0][0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Invalid request:/);
  });

  it('should handle missing required fields', () => {
    const schema = z.object({
      username: z.string(),
      age: z.number()
    });

    mockRequest.body = {
      username: 'testuser'
      // age is missing
    };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    const error = nextFunction.mock.calls[0][0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Invalid request:/);
  });

  it('should validate complex nested objects', () => {
    const schema = z.object({
      user: z.object({
        profile: z.object({
          name: z.string(),
          email: z.string().email()
        })
      })
    });

    mockRequest.body = {
      user: {
        profile: {
          name: 'Test User',
          email: 'invalid-email' // This should fail validation
        }
      }
    };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    const error = nextFunction.mock.calls[0][0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Invalid request:/);
  });

  it('should handle empty request body', () => {
    const schema = z.object({
      username: z.string()
    });

    mockRequest.body = undefined;

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    const error = nextFunction.mock.calls[0][0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Invalid request:/);
  });

  it('should validate array fields', () => {
    const schema = z.object({
      tags: z.array(z.string())
    });

    mockRequest.body = {
      tags: ['tag1', 123] // This should fail validation as 123 is not a string
    };

    const middleware = validateRequest(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledTimes(1);
    const error = nextFunction.mock.calls[0][0] as Error;
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toMatch(/Invalid request:/);
  });
});
