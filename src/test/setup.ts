import supertest from 'supertest';
import app from '../index'; // adjust path as needed
import TestAgent from 'supertest/lib/agent';
import findAvailablePortSync from './find-available-port';

export let server: any;
export let request: TestAgent;

beforeAll((done) => {
  server = app.listen(findAvailablePortSync()); // Let OS assign port
  request = supertest(server);
  done();
});

afterAll((done) => {
  if (server) {
    // Close all existing connections first
    server.closeAllConnections();
    // Then close the server
    server.close((err: any) => {
      if (err) {
        console.error('Error closing server:', err);
      }
      done();
    });
  } else {
    done();
  }
});
