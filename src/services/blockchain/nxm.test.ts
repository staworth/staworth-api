import { describe, it, expect } from 'vitest';
import { 
    getEthNxmBalance,
    getEthNxmValue,
    getNxmPrice,
    getNxmStakingNftUri,
    getStakedNxmBalance,
    getStakedNxmValue,
    getTotalNxmBalance,
    getTotalNxmValue
} from './nxm.js';

const walletAddress = "0x72e7197da72fbc51828fa82cba8683bf0b6acf5e";

describe('getNxmPrice', () => {    
  it('should fetch the current NXM price in USD', async () => {
    const price = await getNxmPrice();
    
    expect(price).toBeDefined();
    expect(typeof price).toBe('number');
    expect(price).toBeGreaterThan(0);
    console.log(`NXM Price: $${price}`);
  });
});

describe('getEthNxmBalance', () => {
  it('should fetch the ETH NXM balance for a wallet address', async () => {
    const balance = await getEthNxmBalance(walletAddress);
    
    expect(balance).toBeDefined();
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
    console.log(`ETH NXM Balance: ${balance}`);
  });
});

describe('getEthNxmValue', () => {
  it('should calculate the USD value of ETH NXM balance', async () => {
    const value = await getEthNxmValue(walletAddress);
    
    expect(value).toBeDefined();
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(0);
    console.log(`ETH NXM Value in USD: $${value}`);
  });
});

describe('getNxmStakingNftUri - Token 238', () => {
  it('should fetch the metadata for tokenId 238', async () => {
    const tokenId = 238;
    const metadata = await getNxmStakingNftUri(tokenId);
    
    expect(metadata).toBeDefined();
    expect(typeof metadata).toBe('object');
    expect(metadata.name).toBeDefined();
    expect(metadata.description).toBeDefined();
    expect(metadata.image).toBeDefined();
    console.log(`Token ${tokenId} metadata:`, metadata);
  });
});

describe('getStakedNxm - Token 238', () => {
  it('should extract and sum staked amount and pending rewards for tokenId 238', async () => {
    const tokenId = 238;
    const total = await getStakedNxmBalance(tokenId);
    
    expect(total).toBeDefined();
    expect(typeof total).toBe('number');
    expect(total).toBeGreaterThan(0);
    console.log(`Token ${tokenId} total staked + rewards:`, total);
  });
});

describe('getStakedNxmValue - Token 238', () => {
  it('should calculate the USD value of staked NXM and rewards for tokenId 238', async () => {
    const tokenId = 238;
    const value = await getStakedNxmValue(tokenId);
    const price = await getNxmPrice();
    
    expect(value).toBeDefined();
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThan(0);
    console.log(`Token ${tokenId} staked NXM value in USD: $${value}`);
  });
});

describe('getTotalNxmBalance', () => {
  it('should calculate the total NXM balance (ETH + Staked) for a wallet', async () => {
    const tokenId = 238;
    const totalBalance = await getTotalNxmBalance(walletAddress, tokenId);
    
    expect(totalBalance).toBeDefined();
    expect(typeof totalBalance).toBe('number');
    expect(totalBalance).toBeGreaterThanOrEqual(0);
    console.log(`Total NXM Balance (ETH + Staked): ${totalBalance}`);
  });
});

describe('getTotalNxmValue', () => {
  it('should calculate the total USD value of NXM balance (ETH + Staked)', async () => {
    const tokenId = 238;
    const totalValue = await getTotalNxmValue(walletAddress, tokenId);
    
    expect(totalValue).toBeDefined();
    expect(typeof totalValue).toBe('number');
    expect(totalValue).toBeGreaterThanOrEqual(0);
    console.log(`Total NXM Value in USD (ETH + Staked): $${totalValue}`);
  });
});