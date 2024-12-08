import { Router } from 'express';
import { donorBox as donorBoxRateLimiter } from './middleware';
import { get } from './controllers';

const router = Router();

router.get('/*', donorBoxRateLimiter, get);
export default router;
