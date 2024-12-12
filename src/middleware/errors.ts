import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // If headers have already been sent, delegate to Express's default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Send error response to client
  res.status(res.statusCode || 500).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    },
  });
};
