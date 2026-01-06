# staworth-api

Simple REST API for service of Staworth's datasets to our various web applications. Using Express.js + TypeScript.

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Running the Server

```bash
pnpm start
```

The server will run on `http://localhost:3001` by default.

## Testing

```bash
pnpm test
```

Runs the test suite using Vitest, including blockchain integration and portfolio aggregation tests.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/health` | Health check - returns server status |
| GET | `/accounts` | Summary of Staworth's onchain accounts |
| GET | `/articles` | Staworth's published articles |
| GET | `/links` | Staworth's important links |
| GET | `/portfolio` | Staworth's portfolio positions from Redis |
| POST | `/portfolio/update` | Trigger portfolio update (requires `x-cron-secret` header) |
| GET | `/beefy/balance-sheet` | Beefy DAO's balance sheet |
| GET | `/beefy/balance-sheet/historic` | Historic balance sheets for Beefy DAO |

## Features

### Portfolio Management
- **Persistent storage**: Portfolio data stored in Redis (Upstash) for reliability and performance
- **Automated updates**: Vercel CRON scheduler runs daily at 1 AM to refresh all portfolio data
- **Multi-chain integration**: Tracks assets across Ethereum, Optimism, Gnosis, Base
- **Token tracking**: BIFI, GNO, NXM (wallet + optional staking NFT), xDAI (sDAI on Gnosis)
- **DeFi positions**: Beefy vaults and Aave V3 aTokens aggregated across wallets
- **Automated aggregation**: Aggregates balances/values across all configured accounts
- **Real-time pricing**: Fetches token and vault prices and calculates USD values

### Data Sources
Portfolio data is aggregated from multiple wallet addresses configured in `data/accounts/accounts.json`. The system automatically queries all accounts and combines their balances and values. Updated portfolio data is persisted to Redis and served via the API.

## Environment Variables

Required environment variables (configured in `.env` and Vercel project settings):

```env
PORTFOLIO_STORE_URL=https://your-upstash-redis-url.upstash.io/
PORTFOLIO_STORE_TOKEN=your-upstash-redis-token
CRON_SECRET=your-random-secret-for-cron-authentication
ALCHEMY_RPC_KEY=your-alchemy-api-key
BEEFY_API_KEY=your-beefy-api-key
DATABARN_API_KEY=your-databarn-api-key
COINGECKO_API_KEY=your-coingecko-api-key
NXM_STAKING_TOKEN_ID=your-nxm-staking-token-id
```

## Deployment

The API is deployed on Vercel with automated CRON scheduling configured in `vercel.json`:
- Schedule: Daily at 1 AM (Hobby plan compatible)
- Endpoint: `POST /portfolio/update`
- Authentication: Secured with `x-cron-secret` header

## Dependencies

| Dependency | Version | Description |
|------------|---------|-------------|
| express | ^5.2.1 | Web application framework |
| cors | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| dotenv | ^17.2.3 | Environment variable management |
| web3 | ^4.16.0 | Web3 library for blockchain interactions |

### Dev Dependencies

| Dependency | Version | Description |
|------------|---------|-------------|
| typescript | ^5.9.3 | TypeScript compiler |
| vitest | ^4.0.16 | Testing framework |
| vercel | ^50.1.3 | Vercel CLI for deployment |
