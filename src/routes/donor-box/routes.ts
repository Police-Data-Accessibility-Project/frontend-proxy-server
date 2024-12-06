import { Router } from 'express';
import { donorBox as donorBoxRateLimiter } from './middleware';
import { post } from './controllers';
import { validateRequest } from '../../middleware/validate-request';
import { donorBoxSchema } from './models';

const router = Router();

router.post('/', donorBoxRateLimiter, validateRequest(donorBoxSchema), post);

export default router;
