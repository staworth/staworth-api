import fs from 'fs';
import path from 'path';
import type { Portfolio, PortfolioItem } from '../../types/portfolio.js';
import { getTotalBifiBalance, getTotalBifiValue } from '../blockchain/bifi.js';
import { getTotalGnoBalance, getTotalGnoValue } from '../blockchain/gno.js';
import { getEthNxmBalance, getEthNxmValue, getStakedNxmBalance, getStakedNxmValue } from '../blockchain/nxm.js';
import { getTotalxDaiBalance, getTotalxDaiValue } from '../blockchain/xdai.js';
import { getBeefyPositions } from '../blockchain/beefyPositions.js';
import { getAaveV3Positions } from '../blockchain/aavePositions.js';
import { readPortfolioFromStore, writePortfolioToStore } from './portfolioStore.js';
import { getAaveMetadata, getBeefyMetadata } from './portfolioMetadata.js';

const ACCOUNTS_PATH = path.join(process.cwd(), 'data', 'accounts', 'accounts.json');

/**
 * Read all wallet addresses from accounts.json
 */
function readAccountAddresses(): string[] {
  try {
    const data = fs.readFileSync(ACCOUNTS_PATH, 'utf-8');
    const accounts = JSON.parse(data) as Record<string, { address: string }>;
    return Object.keys(accounts);
  } catch (error) {
    console.error('Error reading accounts.json:', error);
    throw new Error('Failed to read accounts.json');
  }
}

/**
 * Normalize numeric fields and sort before persisting to the store
 */
function normalizePortfolio(portfolio: Portfolio): Portfolio {
  if (!portfolio || !portfolio.positions) {
    return { positions: {} };
  }

  const sortedPortfolio = sortPortfolio(portfolio);

  const positions = Object.fromEntries(
    Object.entries(sortedPortfolio.positions || {}).map(([key, value]) => {
      const next: PortfolioItem = { ...value };
      if (typeof next.balance === 'number') {
        next.balance = Number(next.balance.toFixed(3));
      }
      if (typeof next.value === 'number') {
        next.value = Number(next.value.toFixed(2));
      }
      return [key, next];
    })
  );

  const normalized: Portfolio = { positions };
  if (sortedPortfolio.total && typeof sortedPortfolio.total.value === 'number') {
    normalized.total = { value: Number(sortedPortfolio.total.value.toFixed(2)) };
  }

  return normalized;
}

/**
 * Read the current portfolio from the remote store
 */
async function readPortfolio(): Promise<Portfolio> {
  return readPortfolioFromStore();
}

/**
 * Sort portfolio positions by type first, then by value (highest to lowest)
 */
function sortPortfolio(portfolio: Portfolio): Portfolio {
  if (!portfolio || !portfolio.positions) {
    return { positions: {} };
  }

  const sortedPositions = Object.entries(portfolio.positions)
    .sort(([_, a], [__, b]) => {
      // First, sort by type alphabetically
      const typeComparison = a.type.localeCompare(b.type);
      if (typeComparison !== 0) {
        return typeComparison;
      }
      // Then, sort by value (highest to lowest)
      return (b.value || 0) - (a.value || 0);
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, PortfolioItem>);

  const result: Portfolio = {
    positions: sortedPositions,
  };

  if (portfolio.total) {
    result.total = portfolio.total;
  }

  return result;
}

/**
 * Write updated portfolio back to the remote store
 */
async function writePortfolio(portfolio: Portfolio): Promise<void> {
  try {
    const normalized = normalizePortfolio(portfolio);
    await writePortfolioToStore(normalized);
  } catch (error) {
    console.error('Error writing portfolio to store:', error);
    throw new Error('Failed to write portfolio');
  }
}

/**
 * Update BIFI portfolio with latest balance and value
 */
async function updateBifiPortfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating BIFI positions for all wallets');

    const wallets = readAccountAddresses();
    const balances = await Promise.all(wallets.map((address) => getTotalBifiBalance(address)));
    const values = await Promise.all(wallets.map((address) => getTotalBifiValue(address)));

    const balanceTotal = Math.round(balances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const valueTotal = Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;

    portfolio.positions.bifi = {
      name: 'Beefy Finance',
      type: 'governance',
      defi_protocol: null,
      url: 'https://beefy.com/',
      img: '/images/portfolio/bifi-token.png',
      balance: balanceTotal,
      value: valueTotal,
    };

    console.log(`BIFI balance: ${portfolio.positions.bifi!.balance}, value: $${portfolio.positions.bifi!.value}`);
  } catch (error) {
    console.error('Error updating BIFI portfolio:', error);
    throw error;
  }
}

/**
 * Update GNO portfolio with latest balance and value
 */
async function updateGnoPortfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating GNO portfolio for all wallets');

    const wallets = readAccountAddresses();
    const balances = await Promise.all(wallets.map((address) => getTotalGnoBalance(address)));
    const values = await Promise.all(wallets.map((address) => getTotalGnoValue(address)));

    const balanceTotal = Math.round(balances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const valueTotal = Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;

    portfolio.positions.gno = {
      name: 'Gnosis',
      type: 'governance',
      defi_protocol: null,
      url: 'https://gnosis.io/',
      img: '/images/portfolio/gno-token.png',
      balance: balanceTotal,
      value: valueTotal,
    };

    console.log(`GNO balance: ${portfolio.positions.gno!.balance}, value: $${portfolio.positions.gno!.value}`);
  } catch (error) {
    console.error('Error updating GNO portfolio:', error);
    throw error;
  }
}

/**
 * Update NXM portfolio with latest balance and value
 */
async function updateNxmPortfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating NXM portfolio for all wallets');

    const wallets = readAccountAddresses();
    const ethBalances = await Promise.all(wallets.map((address) => getEthNxmBalance(address)));
    const ethValues = await Promise.all(wallets.map((address) => getEthNxmValue(address)));

    const stakingTokenIdEnv = process.env.NXM_STAKING_TOKEN_ID;
    const stakingTokenId = stakingTokenIdEnv ? Number(stakingTokenIdEnv) : null;
    const hasStakingTokenId = stakingTokenId !== null && Number.isFinite(stakingTokenId);

    // If no staking token id is configured, skip staking balances to avoid contract reverts (e.g. NotMinted)
    // Staking token is a single NFT position; do not multiply by wallet count
    const stakedBalanceTotal = hasStakingTokenId ? await getStakedNxmBalance(stakingTokenId!) : 0;
    const stakedValueTotal = hasStakingTokenId ? await getStakedNxmValue(stakingTokenId!) : 0;

    const balanceTotal = Math.round((ethBalances.reduce((sum, b) => sum + b, 0) + stakedBalanceTotal) * 1000) / 1000;
    const valueTotal = Math.round((ethValues.reduce((sum, v) => sum + v, 0) + stakedValueTotal) * 100) / 100;

    portfolio.positions.nxm = {
      name: 'Nexus Mutual',
      type: 'governance',
      defi_protocol: null,
      url: 'https://nexusmutual.io/',
      img: '/images/portfolio/nxm-token.png',
      balance: balanceTotal,
      value: valueTotal,
    };

    console.log(`NXM balance: ${portfolio.positions.nxm!.balance}, value: $${portfolio.positions.nxm!.value}`);
  } catch (error) {
    console.error('Error updating NXM portfolio:', error);
    throw error;
  }
}

/**
 * Update xDAI portfolio with latest balance and value
 */
async function updateXDaiPortfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating xDAI portfolio for all wallets');

    const wallets = readAccountAddresses();
    const balances = await Promise.all(wallets.map((address) => getTotalxDaiBalance(address)));
    const values = await Promise.all(wallets.map((address) => getTotalxDaiValue(address)));

    const balanceTotal = Math.round(balances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const valueTotal = Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;

    portfolio.positions.xdai = {
      name: 'xDAI',
      type: 'stablecoin',
      defi_protocol: null,
      url: 'https://docs.gnosischain.com/about/tokens/xdai',
      img: '/images/portfolio/xdai-token.png',
      balance: balanceTotal,
      value: valueTotal,
    };

    console.log(`xDAI balance: ${portfolio.positions.xdai!.balance}, value: $${portfolio.positions.xdai!.value}`);
  } catch (error) {
    console.error('Error updating xDAI portfolio:', error);
    throw error;
  }
}

/**
 * Update Beefy positions portfolio
 */
async function updateBeefyPositionsPortfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating Beefy positions for all wallets');

    const wallets = readAccountAddresses();
    const allPositions = await Promise.all(wallets.map((address) => getBeefyPositions(address)));
    
    // Aggregate positions by vault name across all wallets
    const aggregatedPositions: Record<string, { balance: number; value: number }> = {};
    
    for (const positions of allPositions) {
      for (const [vaultName, position] of Object.entries(positions)) {
        if (!aggregatedPositions[vaultName]) {
          aggregatedPositions[vaultName] = { balance: 0, value: 0 };
        }
        aggregatedPositions[vaultName].balance += position.balance;
        aggregatedPositions[vaultName].value += position.value;
      }
    }
    
    // Remove any existing Beefy positions to avoid stale or double-counted entries
    if (portfolio.positions) {
      for (const key of Object.keys(portfolio.positions)) {
        if (portfolio.positions[key]?.defi_protocol === 'beefy') {
          delete portfolio.positions[key];
        }
      }
    }
    
    // Update portfolio with aggregated positions
    for (const [vaultName, position] of Object.entries(aggregatedPositions)) {
      const metadata = getBeefyMetadata(vaultName);
      portfolio.positions[vaultName] = {
        name: metadata.name,
        type: 'defi',
        defi_protocol: 'beefy',
        url: metadata.url,
        img: metadata.img,
        balance: Math.round(position.balance * 1000) / 1000,
        value: Math.round(position.value * 100) / 100,
      };
      console.log(`${vaultName}: balance ${portfolio.positions[vaultName]!.balance}, value $${portfolio.positions[vaultName]!.value}`);
    }

    if (!Object.keys(aggregatedPositions).length) {
      console.log('No Beefy positions found; skipping Beefy portfolio updates for now.');
    }
  } catch (error) {
    console.error('Error updating Beefy positions:', error);
    throw error;
  }
}

/**
 * Update Aave V3 positions portfolio
 */
async function updateAaveV3Portfolio(portfolio: Portfolio): Promise<void> {
  try {
    console.log('Updating Aave V3 positions for all wallets');

    const wallets = readAccountAddresses();
    const allPositions = await Promise.all(wallets.map((address) => getAaveV3Positions(address)));
    
    // Aggregate positions by token name across all wallets
    const aggregatedPositions: Record<string, { balance: number; value: number }> = {};
    
    for (const positions of allPositions) {
      for (const [tokenName, position] of Object.entries(positions)) {
        if (!aggregatedPositions[tokenName]) {
          aggregatedPositions[tokenName] = { balance: 0, value: 0 };
        }
        aggregatedPositions[tokenName].balance += position.balance;
        aggregatedPositions[tokenName].value += position.value;
      }
    }
    
    // Remove any existing Aave positions to avoid stale or double-counted entries
    if (portfolio.positions) {
      for (const key of Object.keys(portfolio.positions)) {
        if (portfolio.positions[key]?.defi_protocol === 'aave') {
          delete portfolio.positions[key];
        }
      }
    }
    
    // Update portfolio with aggregated positions
    for (const [tokenName, position] of Object.entries(aggregatedPositions)) {
      const metadata = getAaveMetadata(tokenName);
      portfolio.positions[tokenName] = {
        name: metadata.name,
        type: 'defi',
        defi_protocol: 'aave',
        url: metadata.url,
        img: metadata.img,
        balance: Math.round(position.balance * 1000) / 1000,
        value: Math.round(position.value * 100) / 100,
      };
      console.log(`${tokenName}: balance ${portfolio.positions[tokenName]!.balance}, value $${portfolio.positions[tokenName]!.value}`);
    }
  } catch (error) {
    console.error('Error updating Aave V3 positions:', error);
    throw error;
  }
}

async function updatePortfolio(): Promise<Portfolio> {
  const portfolio = await readPortfolio();
  
  // Ensure positions object exists
  if (!portfolio.positions) {
    portfolio.positions = {};
  }

  const tasks: Promise<void>[] = [
    updateBifiPortfolio(portfolio),
    updateGnoPortfolio(portfolio),
    updateNxmPortfolio(portfolio),
    updateXDaiPortfolio(portfolio),
    updateBeefyPositionsPortfolio(portfolio),
    updateAaveV3Portfolio(portfolio),
  ];

  await Promise.all(tasks);

  const totalValue = Object.values(portfolio.positions).reduce((sum, position) => sum + (position.value || 0), 0);
  portfolio.total = { value: Math.round(totalValue * 100) / 100 };
  await writePortfolio(portfolio);

  return portfolio;
}

export { updatePortfolio, updateBifiPortfolio, updateGnoPortfolio, updateNxmPortfolio, updateXDaiPortfolio, updateBeefyPositionsPortfolio, updateAaveV3Portfolio, readPortfolio, writePortfolio };