import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', webhookRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'AUTODIGIX Multi-CRM Lead Routing Engine',
    status: 'Online',
    version: '1.0.0',
    endpoints: {
      webhook: 'POST /api/leads',
      health: 'GET /health'
    },
    timestamp: new Date().toISOString()
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
