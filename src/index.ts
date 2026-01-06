import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accountsRoutes from './routes/accountsRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';
import linksRoutes from './routes/linksRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import balanceSheetRoutes from './routes/balanceSheetRoutes.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Staworth API (TypeScript)',
    description: 'Simple REST API for service of Staworth\'s datasets to our various web applications.',
    status: 'ok',
    endpoints: {
      'GET /health': 'Health check.',
      'GET /accounts': "Summary of Staworth's onchain accounts.",
      'GET /articles': "Staworth's published articles.",
      'GET /links': "Staworth's important links.",
      'GET /portfolio': "Staworth's portfolio holdings.",
      'POST /portfolio/update': "Trigger portfolio update (requires x-cron-secret header).",
      'GET /beefy/balance-sheet': "Beefy DAO's balance sheet.",
      'GET /beefy/balance-sheet/historic': "Historic balance sheets for Beefy DAO.",
    }
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/accounts', accountsRoutes);
app.use('/articles', articlesRoutes);
app.use('/links', linksRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/beefy/balance-sheet', balanceSheetRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  • GET  /health                       - Health check`);
  console.log(`  • GET  /accounts                     - Summary of Staworth's onchain accounts`);
  console.log(`  • GET  /articles                     - Staworth's published articles`);
  console.log(`  • GET  /links                        - Staworth's important links`);
  console.log(`  • GET  /portfolio                    - Staworth's portfolio holdings`);
  console.log(`  • POST /portfolio/update             - Trigger portfolio update (requires x-cron-secret header)`);
  console.log(`  • GET  /beefy/balance-sheet          - Beefy DAO's balance sheet`);
  console.log(`  • GET  /beefy/balance-sheet/historic - Historic balance sheets for Beefy DAO`);
});