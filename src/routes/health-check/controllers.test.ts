import { Request, Response } from 'express';
import { get } from './controllers';

describe('Health Check Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDate: number;

  beforeEach(() => {
    // Setup mock date
    mockDate = 1234567890;
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);

    // Setup mock process.uptime
    jest.spyOn(process, 'uptime').mockImplementation(() => 100);

    // Setup mock request and response
    mockRequest = {};
    mockResponse = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return successful health check response', () => {
    get(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.send).toHaveBeenCalledWith({
      uptime: 100,
      message: 'OK',
      timestamp: mockDate,
    });
  });

  it('should handle errors and return 503 status', () => {
    // Mock response.send to throw an error
    mockResponse.send = jest.fn().mockImplementationOnce(() => {
      throw new Error('Mock error');
    });

    get(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(503);
    expect(mockResponse.send).toHaveBeenLastCalledWith({
      uptime: 100,
      message: 'ERROR',
      timestamp: mockDate,
    });
  });
});
