import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountsRoutes from './routes/accountsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Staworth API (TypeScript)',
    description: 'TypeScript Express server for Habeas Data services using x402 payments',
    status: 'ok',
    endpoints: {
      'GET /health': 'Health check.',
      'GET /api/accounts': "Summary of Staworth's onchain accounts.",
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api/accounts', accountsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  • GET  /health                       - Health check`);
  console.log(`  • GET  /api/accounts                 - Summary of Staworth's onchain accounts`);
});