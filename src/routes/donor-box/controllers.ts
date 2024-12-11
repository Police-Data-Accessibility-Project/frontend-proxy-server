import { NextFunction, Request, Response } from 'express';
import config from '../../config';
import axios from 'axios';

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const authKey = config.DONOR_BOX_AUTH_ALIAS;
    const authValue = config.DONOR_BOX_AUTH_SECRET;

    if (!authKey || !authValue) {
      return next(new Error('Missing authentication credentials'));
    }

    // Get everything after /donor-box in the original request path
    const donorBoxPath = req.path.replace(/^\/donor-box/, '');

    const response = await axios.get(`https://donorbox.org${donorBoxPath}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${authKey}:${authValue}`)}`,
      },
      params: req.query, // Pass through any query parameters
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
}
