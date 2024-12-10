import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  DONOR_BOX_AUTH_ALIAS: process.env.DONOR_BOX_AUTH_ALIAS,
  DONOR_BOX_AUTH_SECRET: process.env.DONOR_BOX_AUTH_SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || '*',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // HOST: process.env.HOST || 'localhost',
};

console.log('config', config);

export default config;
