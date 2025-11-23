const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "https://assignment-d8jj.onrender.com",  // Your web app URL
      "http://localhost:3000"                    // For local development
    ],
    methods: ["GET", "POST", "DELETE"]
  }
});

app.use(cors({
  origin: [
    "https://assignment-d8jj.onrender.com",  // Your web app URL
    "http://localhost:3000"                    // For local development
  ]
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for image uploads

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Request Management API',
    version: '1.0.0',
    endpoints: {
      'POST /request': 'Create a new request',
      'GET /requests': 'Get all requests',
      'GET /requests/sorted?order=asc|desc': 'Get sorted requests',
      'GET /requests/search?title=...': 'Search requests by title',
      'DELETE /request/:id': 'Delete a request by ID',
      'GET /health': 'Health check endpoint'
    },
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

const requestRoutes = require('./routes/requests')(io);
app.use('/request', requestRoutes);
app.use('/requests', requestRoutes);

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /request',
      'GET /requests',
      'GET /requests/sorted',
      'GET /requests/search',
      'DELETE /request/:id'
    ]
  });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/requestapp')  
.then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.log('MongoDB connection error:', err.message);
    console.log('⚠️  Server will continue but database operations will fail');
    console.log('💡 Make sure MongoDB is running or set MONGO_URI in .env');
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
  console.log(`📱 For mobile: Use http://192.168.1.8:${PORT} (your local IP)`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('💡 Kill the process using: netstat -ano | findstr :5000');
    console.log('   Then: taskkill /PID <PID> /F');
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
