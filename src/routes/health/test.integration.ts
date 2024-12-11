import express from 'express';
import serverRoutes from './routes';
import request from 'supertest';
const app = express();
app.use('/health', serverRoutes);

describe('Health check API', () => {
  it('should return 200 and correct health check response', async () => {
    const { body } = await request(app).get('/health'); //uses the request function that calls on express app instance

    expect(body).toHaveProperty('uptime');
    expect(body).toHaveProperty('message', 'OK');
    expect(body).toHaveProperty('timestamp');
  });
});
