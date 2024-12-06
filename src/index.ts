import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { global as rateLimiter } from './middleware/rate-limiter';
import config from './config';
import { errorHandler } from './middleware/errors';
import donorBoxRouter from './routes/donor-box';
import { corsOptions } from './middleware/cors';

dotenv.config();

const app = express();
const port = config.PORT || 3000;

app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/donor-box', donorBoxRouter);

app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
