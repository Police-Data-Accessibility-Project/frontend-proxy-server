import rateLimit from 'express-rate-limit';

// Rate limiting configuration
export const global = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  skipFailedRequests: false, // Count failed requests (status >= 400)
});
