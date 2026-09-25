const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/behavior', require('./routes/behaviorRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/subscribe', require('./routes/subscriberRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Jos Pulse API Engine Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server executing in ${process.env.NODE_ENV} mode on port${PORT}`));