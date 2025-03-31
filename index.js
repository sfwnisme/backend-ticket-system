// -------------------------------
// Application main file
// -------------------------------

const app = require('./src/app')

// Create the server instance
const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server working on port ${process.env.PORT || 5000}`);
});


// // Graceful shutdown handlers
// const shutdown = (signal) => {
//   console.log(`${signal} received. Closing server...`);
//   server.close(() => {
//     console.log('Server closed');
//     if (signal === 'SIGUSR2') {
//       // Special case for Nodemon restart
//       process.kill(process.pid, signal);
//     } else {
//       process.exit(0);
//     }
//   });
// };

// // Handle various termination signals
// process.on('SIGTERM', () => shutdown('SIGTERM'));  // For normal termination
// process.on('SIGINT', () => shutdown('SIGINT'));   // For Ctrl+C
// process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For Nodemon restarts