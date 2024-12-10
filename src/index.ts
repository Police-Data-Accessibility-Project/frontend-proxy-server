// Globals
import config from './config';

// Deps
import express from 'express';
import cors from 'cors';

// Middleware
import { corsOptions } from './middleware/cors';
import { errorHandler } from './middleware/errors';
import { global as rateLimiter } from './middleware/rate-limiter';

// Logs
import { logger, requestLogger, errorLogger, addRequestId } from './middleware/logger';

// Routes
import donorBoxRouter from './routes/donor-box';
import healthRouter from './routes/health';

const app = express();
const port = config.PORT;

app.set('trust proxy', 1);
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(addRequestId);
app.use(requestLogger);

// Test routes
// @ts-expect-error foo
app.get('/x-forwarded-for', (request, response) =>
  response.send(request.headers['x-forwarded-for'])
);
// @ts-expect-error foo
app.get('/ip', (request, response) => response.send(request.ip));
// Routes
app.use('/health', healthRouter);
app.use('/donor-box', donorBoxRouter);

app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
