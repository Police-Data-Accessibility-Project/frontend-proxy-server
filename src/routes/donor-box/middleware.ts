import rateLimit from 'express-rate-limit';

export const donorBox = rateLimit({
  windowMs: 60 * 1000 * 5, // 5 minutees
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests to donor-box endpoint, please try again after 1 minute',
  },
});
