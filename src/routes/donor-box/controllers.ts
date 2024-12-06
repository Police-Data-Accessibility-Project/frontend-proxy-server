import { NextFunction, Request, Response } from 'express';
import { DonorBoxRequestBody } from './models';
import config from '../../config';
import axios from 'axios';

export async function post(
  req: Request<unknown, unknown, { path: string; params?: DonorBoxRequestBody }>,
  res: Response,
  next: NextFunction
) {
  try {
    const authKey = config.DONOR_BOX_AUTH_ALIAS;
    const authValue = config.DONOR_BOX_AUTH_SECRET;
    const path = req.body.path;
    const params = req.body.params ?? {};

    if (!authKey || !authValue) {
      throw new Error('Missing authentication credentials');
    }

    if (!path) {
      // TODO: replace with validation
      throw new Error('Missing donorbox path');
    }

    const response = await axios.get(`https://donorbox.org${path}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(`${authKey}:${authValue}`)}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = new Error(error.message);
      next(err);
    } else {
      next(error);
    }
  }
}
