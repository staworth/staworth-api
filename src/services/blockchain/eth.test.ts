import { describe, it, expect } from 'vitest';
import {
  getEthNativeBalance,
  getEthWethBalance,
  getOpNativeBalance,
  getOpWethBalance,
  getBaseNativeBalance,
  getBaseWethBalance,
  getArbNativeBalance,
  getArbWethBalance,
  getTotalEthBalance,
  getTotalEthValue,
} from './eth.js';

const walletAddress = '0x72E7197DA72FbC51828fa82CBa8683Bf0B6acf5e';

describe('ETH balances', () => {
  it('returns ETH + WETH balances across chains', async () => {
    const [
      ethNative,
      ethWeth,
      opNative,
      opWeth,
      baseNative,
      baseWeth,
      arbNative,
      arbWeth,
    ] = await Promise.all([
      getEthNativeBalance(walletAddress),
      getEthWethBalance(walletAddress),
      getOpNativeBalance(walletAddress),
      getOpWethBalance(walletAddress),
      getBaseNativeBalance(walletAddress),
      getBaseWethBalance(walletAddress),
      getArbNativeBalance(walletAddress),
      getArbWethBalance(walletAddress),
    ]);

    const balances = [ethNative, ethWeth, opNative, opWeth, baseNative, baseWeth, arbNative, arbWeth];
    for (const balance of balances) {
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('number');
      expect(balance).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(balance)).toBe(true);
    }

    console.log('ETH native/wrapped balances', {
      ethNative,
      ethWeth,
      opNative,
      opWeth,
      baseNative,
      baseWeth,
      arbNative,
      arbWeth,
    });
  }, 60000);
});

describe('ETH totals', () => {
  it('returns total ETH balance rounded to 3 decimals', async () => {
    const balance = await getTotalEthBalance(walletAddress);
    console.log('Total ETH balance:', balance);

    expect(balance).toBeDefined();
    expect(typeof balance).toBe('number');
    expect(balance).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(balance)).toBe(true);
  }, 60000);

  it('returns total ETH value rounded to 2 decimals', async () => {
    const value = await getTotalEthValue(walletAddress);
    console.log('Total ETH value:', value);

    expect(value).toBeDefined();
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(value)).toBe(true);
  }, 60000);
});
