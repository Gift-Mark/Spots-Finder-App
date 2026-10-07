const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Built-in Node.js HTTP module required for Socket.io
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Create HTTP server wrapping Express
const server = http.createServer(app);

// Initialize Socket.io with CORS settings
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to match your frontend client URL (e.g., http://localhost:3000)
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Attach Socket.io instance to `req` so API routes can emit real-time events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/places', require('./routes/placeRouter'));
app.use('/api/behavior', require('./routes/behaviorRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/subscribe', require('./routes/subscriberRoutes'));
app.use('api/saves', require('./routes/saveRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Jos Pulse API Engine Running with Real-Time WebSockets...');
});

// --- REAL-TIME SOCKET.IO ENGINE --- //
io.on('connection', (socket) => {
  console.log(`⚡ [Real-time Engine] Client Connected: ${socket.id}`);

  // Example: Client joins a specific location room (e.g., Rayfield, Shere Hills)
  socket.on('join_location', (locationId) => {
    socket.join(locationId);
    console.log(`📍 Client ${socket.id} joined location channel: ${locationId}`);
  });

  // Example: Client sends a real-time behavioral action or check-in
  socket.on('send_behavior_update', (data) => {
    // Broadcast live event to all connected users
    io.emit('behavior_updated', data);
  });

  socket.on('disconnect', () => {
    console.log(`❌ [Real-time Engine] Client Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

// IMPORTANT: Listen on `server` (HTTP + Socket.io), NOT `app`
server.listen(PORT, () => {
  console.log(`🚀 Server executing in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});