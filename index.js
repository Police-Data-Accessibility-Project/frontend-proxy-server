// // Globals
import config from './config.js';
import corsProxy from 'cors-anywhere';

// Listen on a specific host via the HOST environment variable
const host = config.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = config.PORT || 3000;

const server = corsProxy.createServer({
  httpProxyOptions: {
    secure: false,
  },
  originWhitelist: config.ALLOWED_ORIGINS === '*' 
    ? [] // Empty array means allow all origins
    : config.ALLOWED_ORIGINS.split(','), // Or split string of allowed origins
  // requireHeader: ['x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
});

server.on('error', function(err) {
  console.error('Proxy error:', err);
});

server.listen(port, host, function () {
  console.info('Running CORS Anywhere on ' + host + ':' + port);
});
