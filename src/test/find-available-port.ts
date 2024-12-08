// import { createServer } from 'net';

// export default function findAvailablePort(startPort = 3000): Promise<number> {
//   return new Promise((resolve, reject) => {
//     const server = createServer();

//     server.on('error', (err: NodeJS.ErrnoException) => {
//       if (err.code === 'EADDRINUSE') {
//         // Port is in use, try the next one
//         server.close(() => {
//           resolve(findAvailablePort(startPort + 1));
//         });
//       } else {
//         reject(err);
//       }
//     });

//     server.listen(startPort, () => {
//       const { port } = server.address() as { port: number };
//       server.close(() => {
//         resolve(port);
//       });
//     });
//   });
// }

import { execSync } from 'child_process';

export default function findAvailablePortSync(startPort = 3000, endPort = 65535): number {
  for (let port = startPort; port <= endPort; port++) {
    try {
      // Try to bind to the port using netstat
      execSync(`lsof -i:${port}`, { stdio: 'ignore' });
    } catch {
      // If the command fails, the port is available
      return port;
    }
  }

  throw new Error('No available ports found');
}
