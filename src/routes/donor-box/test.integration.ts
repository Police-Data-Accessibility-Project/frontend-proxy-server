import express from 'express';
import serverRoutes from './routes';
import request from 'supertest';
const app = express();
app.use('/donor-box', serverRoutes);

describe('DonorBox proxy API', () => {
  it('GET /donor-box - no params - success', async () => {
    const { body } = await request(app).get('/donor-box/api/v1/donations').expect(200);

    body.forEach((record: any) => expect(record).toHaveProperty('campaign'));
    body.forEach((record: any) => expect(record).toHaveProperty('donor'));
    body.forEach((record: any) => expect(record).toHaveProperty('amount'));
  });

  it('GET /donor-box - with params - success', async () => {
    const { body } = await request(app).get('/donor-box/api/v1/campaigns?id=1234').expect(200);

    body.forEach((record: any) => expect(record).toHaveProperty('id'));
    body.forEach((record: any) => expect(record).toHaveProperty('name'));
    body.forEach((record: any) => expect(record).toHaveProperty('goal_amt'));
    body.forEach((record: any) => expect(record).toHaveProperty('total_raised'));
  });
});
