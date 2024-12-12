import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { get } from './controllers';
import config from '../../config';

// Mock axios and config
jest.mock('axios');
jest.mock('../../config', () => ({
  DONOR_BOX_AUTH_ALIAS: 'test-alias',
  DONOR_BOX_AUTH_SECRET: 'test-secret'
}));

describe('DonorBox Controller - get', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      path: '/donor-box/api/v1/donations',
      query: { page: '1' }
    };
    mockRes = {
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully forward the request to DonorBox', async () => {
    const mockResponse = { data: { donations: [] } };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    await get(mockReq as Request, mockRes as Response, mockNext);

    // Verify axios was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith(
      'https://donorbox.org/api/v1/donations',
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('test-alias:test-secret')}`
        },
        params: { page: '1' }
      }
    );

    // Verify response was sent
    expect(mockRes.json).toHaveBeenCalledWith(mockResponse.data);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle missing authentication credentials', async () => {
    // Temporarily override config values
    const originalConfig = { ...config };
    (config as any).DONOR_BOX_AUTH_ALIAS = undefined;
    
    await get(mockReq as Request, mockRes as Response, mockNext);

    // Verify error handling
    expect(mockNext).toHaveBeenCalledWith(
      new Error('Missing authentication credentials')
    );
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();

    // Restore config
    Object.assign(config, originalConfig);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

    await get(mockReq as Request, mockRes as Response, mockNext);

    // Verify error handling
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it('should correctly strip /donor-box prefix from path', async () => {
    const mockResponse = { data: { donations: [] } };
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    mockReq = {...mockReq, path: '/donor-box/api/v1/campaigns'};
    
    await get(mockReq as Request, mockRes as Response, mockNext);

    // Verify correct path handling
    expect(axios.get).toHaveBeenCalledWith(
      'https://donorbox.org/api/v1/campaigns',
      expect.any(Object)
    );
  });
});

