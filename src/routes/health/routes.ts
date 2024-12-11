import { Router } from 'express';
import { get } from './controllers';

const router = Router();

router.get('/', get);

export default router;
