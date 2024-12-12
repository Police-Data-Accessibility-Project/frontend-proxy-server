import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

/** Middleware to validate request body against a Zod schema
 *
 * @example
 * app.post('/route', validateRequest(mySchema), handler)
 * */
export const validateRequest = (schema: z.Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        next(new Error(`Invalid request: ${error.message}`));
      } else {
        next(new Error('Invalid request'));
      }
      return;
    }
  };
};
