import rateLimit from 'express-rate-limit';

export const donorBox = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests to donor-box endpoint, please try again after 1 minute',
  },
});
