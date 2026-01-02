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

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and available endpoints |
| GET | `/health` | Health check - returns server status |
| GET | `/api/accounts` | Summary of Staworth's onchain accounts |

## Dependencies

| Dependency | Version | Description |
|------------|---------|-------------|
| express | ^5.2.1 | Web application framework |
| cors | ^2.8.5 | Cross-Origin Resource Sharing middleware |
| dotenv | ^17.2.3 | Environment variable management |
| typescript | ^5.9.3 | TypeScript compiler |
