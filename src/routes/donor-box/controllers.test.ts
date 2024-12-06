import { Request, Response, NextFunction } from 'express';
import { post } from './controllers';
import axios from 'axios';

// Mock axios and config
jest.mock('axios');
jest.mock('../../config', () => ({
  DONOR_BOX_AUTH_ALIAS: 'test-alias',
  DONOR_BOX_AUTH_SECRET: 'test-secret',
}));

describe('DonorBox Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset mocks before each test
    mockRequest = {
      body: {
        path: '/test-path',
        params: { key: 'value' },
      },
    };

    mockResponse = {
      json: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully make a request to DonorBox and return data', async () => {
    const mockData = { success: true };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    await post(mockRequest as Request, mockResponse as Response, mockNext);

    // Verify axios was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith('https://donorbox.org/test-path', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa('test-alias:test-secret')}`,
      },
      params: { key: 'value' },
    });

    // Verify response
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle missing params in request body', async () => {
    const mockData = { success: true };
    mockRequest.body = { path: '/test-path' };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    await post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(axios.get).toHaveBeenCalledWith('https://donorbox.org/test-path', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa('test-alias:test-secret')}`,
      },
      params: {},
    });
  });

  it('should handle axios errors', async () => {
    const axiosError = new Error('Network error');
    (axiosError as any).isAxiosError = true;
    (axios.get as jest.Mock).mockRejectedValueOnce(axiosError);

    await post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new Error('Network error'));
  });

  it('should handle non-axios errors', async () => {
    const generalError = new Error('General error');
    (axios.get as jest.Mock).mockRejectedValueOnce(generalError);

    await post(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(generalError);
  });
});
