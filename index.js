// // Globals
import config from './config.js';
import corsProxy from 'cors-anywhere';

// Listen on a specific host via the HOST environment variable
const host = config.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = config.PORT || 8080;

const server = corsProxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
});

server.listen(port, host, function () {
  console.info('Running CORS Anywhere on ' + host + ':' + port);
});
