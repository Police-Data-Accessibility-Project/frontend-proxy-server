// Globals
import config from './config';

// Deps
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

// Middleware
import { corsOptions } from './middleware/cors';
import { errorHandler } from './middleware/errors';
import { global as rateLimiter } from './middleware/rate-limiter';

// Logs
import { logger, requestLogger, errorLogger, LoggedRequest } from './middleware/logger';

// Routes
import donorBoxRouter from './routes/donor-box';
import healthRouter from './routes/health-check/route';

const app = express();
const port = config.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as LoggedRequest).id = crypto.randomUUID(); // or use uuid package
  next();
});
app.use(requestLogger);
app.use(errorLogger);
app.use(errorHandler);

// Routes
app.use('/health', healthRouter);
app.use('/donor-box', donorBoxRouter);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
