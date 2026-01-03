import fs from 'fs';
import path from 'path';
import { getTotalBifiBalance, getTotalBifiValue } from '../blockchain/bifi.js';
import { getTotalGnoBalance, getTotalGnoValue } from '../blockchain/gno.js';
import { getEthNxmBalance, getEthNxmValue, getStakedNxmBalance, getStakedNxmValue } from '../blockchain/nxm.js';

interface BifiData {
  balance: number;
  value: number;
}

interface Portfolio {
  bifi: BifiData;
  gno?: BifiData;
  nxm?: BifiData;
  eth?: BifiData;
  total?: {
    value: number;
  };
  [key: string]: unknown;
}

const PORTFOLIO_PATH = path.join(process.cwd(), 'data', 'portfolio', 'portfolio.json');
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
 * Read the current portfolio from portfolio.json
 */
function readPortfolio(): Portfolio {
  try {
    const data = fs.readFileSync(PORTFOLIO_PATH, 'utf-8');
    return JSON.parse(data) as Portfolio;
  } catch (error) {
    console.error('Error reading portfolio.json:', error);
    throw new Error('Failed to read portfolio.json');
  }
}

/**
 * Sort portfolio by value (highest to lowest), keeping total last
 */
function sortPortfolio(portfolio: Portfolio): Portfolio {
  const { total, ...assets } = portfolio;
  
  // Sort assets by value descending
  const sortedAssets = Object.entries(assets)
    .filter(([_, data]) => data && typeof data === 'object' && 'value' in data)
    .sort(([_, a], [__, b]) => ((b as BifiData).value || 0) - ((a as BifiData).value || 0))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
  
  // Add back any non-asset fields and then add total last
  const result: Portfolio = sortedAssets as Portfolio;
  if (total) {
    result.total = total;
  }
  
  return result;
}

/**
 * Write updated portfolio back to portfolio.json
 */
function writePortfolio(portfolio: Portfolio): void {
  try {
    // Sort portfolio before writing
    const sortedPortfolio = sortPortfolio(portfolio);
    
    let json = JSON.stringify(sortedPortfolio, null, 4);
    
    // Ensure balance fields have 3 decimal places and value fields have 2 decimal places
    json = json.replace(/"balance":\s*(\d+\.?\d*)/g, (match, num) => {
      const formatted = parseFloat(num).toFixed(3);
      return `"balance": ${formatted}`;
    });
    json = json.replace(/"value":\s*(\d+\.?\d*)/g, (match, num) => {
      const formatted = parseFloat(num).toFixed(2);
      return `"value": ${formatted}`;
    });
    
    fs.writeFileSync(PORTFOLIO_PATH, json, 'utf-8');
    console.log('Portfolio updated successfully');
  } catch (error) {
    console.error('Error writing portfolio.json:', error);
    throw new Error('Failed to write portfolio.json');
  }
}

/**
 * Update BIFI portfolio with latest balance and value
 */
async function updateBifiPortfolio(): Promise<void> {
  try {
    console.log('Updating BIFI portfolio for all wallets');

    const wallets = readAccountAddresses();
    const balances = await Promise.all(wallets.map((address) => getTotalBifiBalance(address)));
    const values = await Promise.all(wallets.map((address) => getTotalBifiValue(address)));

    const balanceTotal = Math.round(balances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const valueTotal = Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;

    // Read current portfolio
    const portfolio = readPortfolio();

    // Update BIFI data (balance: 3 decimals, value: 2 decimals)
    portfolio.bifi = {
      balance: balanceTotal,
      value: valueTotal,
    };

    // Write updated portfolio
    writePortfolio(portfolio);

    console.log(`BIFI balance: ${portfolio.bifi.balance}, value: $${portfolio.bifi.value}`);
  } catch (error) {
    console.error('Error updating BIFI portfolio:', error);
    throw error;
  }
}

/**
 * Update GNO portfolio with latest balance and value
 */
async function updateGnoPortfolio(): Promise<void> {
  try {
    console.log('Updating GNO portfolio for all wallets');

    const wallets = readAccountAddresses();
    const balances = await Promise.all(wallets.map((address) => getTotalGnoBalance(address)));
    const values = await Promise.all(wallets.map((address) => getTotalGnoValue(address)));

    const balanceTotal = Math.round(balances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const valueTotal = Math.round(values.reduce((sum, v) => sum + v, 0) * 100) / 100;

    const portfolio = readPortfolio();

    portfolio.gno = {
      balance: balanceTotal,
      value: valueTotal,
    };

    writePortfolio(portfolio);

    console.log(`GNO balance: ${portfolio.gno.balance}, value: $${portfolio.gno.value}`);
  } catch (error) {
    console.error('Error updating GNO portfolio:', error);
    throw error;
  }
}

/**
 * Update NXM portfolio with latest balance and value
 */
async function updateNxmPortfolio(): Promise<void> {
  try {
    console.log('Updating NXM portfolio for all wallets');

    const wallets = readAccountAddresses();
    const stakingTokenId = 238; // Token ID for staking NFT
    
    // Get ETH NXM balances and values for each wallet
    const ethBalances = await Promise.all(wallets.map((address) => getEthNxmBalance(address)));
    const ethValues = await Promise.all(wallets.map((address) => getEthNxmValue(address)));
    
    // Get staked NXM balance and value once (not per wallet)
    const stakedBalance = await getStakedNxmBalance(stakingTokenId);
    const stakedValue = await getStakedNxmValue(stakingTokenId);

    // Sum ETH NXM across all wallets
    const ethBalanceTotal = Math.round(ethBalances.reduce((sum, b) => sum + b, 0) * 1000) / 1000;
    const ethValueTotal = Math.round(ethValues.reduce((sum, v) => sum + v, 0) * 100) / 100;
    
    // Add staked NXM once
    const balanceTotal = Math.round((ethBalanceTotal + stakedBalance) * 1000) / 1000;
    const valueTotal = Math.round((ethValueTotal + stakedValue) * 100) / 100;

    const portfolio = readPortfolio();

    portfolio.nxm = {
      balance: balanceTotal,
      value: valueTotal,
    };

    writePortfolio(portfolio);

    console.log(`NXM balance: ${portfolio.nxm.balance}, value: $${portfolio.nxm.value}`);
  } catch (error) {
    console.error('Error updating NXM portfolio:', error);
    throw error;
  }
}

/**
 * Update entire portfolio (BIFI, GNO, etc.) and return the updated snapshot.
 */

async function updatePortfolio(): Promise<Portfolio> {
  await Promise.all([
    updateBifiPortfolio(),
    updateGnoPortfolio(),
    updateNxmPortfolio(),
  ]);

  // After updating individual portfolios, update total value
  const portfolio = readPortfolio();
  const totalValue = 
    (portfolio.bifi?.value || 0) + 
    (portfolio.gno?.value || 0) + 
    (portfolio.nxm?.value || 0) + 
    (portfolio.eth?.value || 0);

  portfolio.total = {
    value: Math.round(totalValue * 100) / 100,
  };
  
  writePortfolio(portfolio);

  return portfolio;
}

export { updatePortfolio, updateBifiPortfolio, updateGnoPortfolio, updateNxmPortfolio, readPortfolio, writePortfolio };