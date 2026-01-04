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
| GET | `/portfolio` | Staworth's portfolio holdings (BIFI, GNO, NXM, xDAI, Beefy/Aave positions) |

## Features

### Portfolio Management
- **Multi-chain integration**: Tracks assets across Ethereum, Optimism, Gnosis, Base
- **Token tracking**: BIFI, GNO, NXM (wallet + optional staking NFT), xDAI (sDAI on Gnosis)
- **DeFi positions**: Beefy vaults and Aave V3 aTokens aggregated across wallets
- **Automated aggregation**: Aggregates balances/values across all configured accounts
- **Real-time pricing**: Fetches token and vault prices and calculates USD values

### Data Sources
Portfolio data is aggregated from multiple wallet addresses configured in `data/accounts/accounts.json`. The system automatically queries all accounts and combines their balances and values.

## Dependencies

| Dependency | Version | Description |
|------------|---------|-------------|
| express | ^5.2.1 | Web application framework |
| cors | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| dotenv | ^17.2.3 | Environment variable management |
| web3 | ^4.16.0 | Web3 library for blockchain interactions |
| typescript | ^5.9.3 | TypeScript compiler |
| vitest | ^4.0.16 | Testing framework |
