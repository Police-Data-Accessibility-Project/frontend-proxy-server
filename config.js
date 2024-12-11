import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  DONOR_BOX_AUTH_ALIAS: process.env.DONOR_BOX_AUTH_ALIAS,
  DONOR_BOX_AUTH_SECRET: process.env.DONOR_BOX_AUTH_SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT,
  HOST: process.env.HOST,
};

export default config;
