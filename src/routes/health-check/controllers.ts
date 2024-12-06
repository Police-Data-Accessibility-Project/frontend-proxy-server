import { Request, Response } from 'express';

export function get(_req: Request, res: Response) {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    res.send(healthcheck);
  } catch {
    healthcheck.message = 'ERROR';
    res.status(503).send(new Error('Service Unavailable'));
  }
}
