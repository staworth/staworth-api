import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contract, Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const ethWeth = typedContracts.ethweth!;
const opWeth = typedContracts.opweth!;
const baseWeth = typedContracts.baseweth!;
const arbWeth = typedContracts.arbweth!;

async function getEthPrice(): Promise<number> {
  if (!ethWeth?.price_symbol || !ethWeth?.price_source) {
    throw new Error('Error: ETH price symbol or source is missing from contracts config');
  }
  return getPrice(ethWeth.price_symbol, ethWeth.price_source);
}

async function getNativeBalance(chain: string, walletAddress: string): Promise<number> {
  const web3 = getWeb3(chain);
  const balanceRaw = await web3.eth.getBalance(walletAddress);
  return Math.round((Number(balanceRaw) / 1e18) * 1e8) / 1e8;
}

async function getWethBalance(contract: Contract, walletAddress: string): Promise<number> {
  const web3 = getWeb3(contract.chain);
  if (!contract?.abi || !contract?.address) {
    throw new Error(`Error: ${contract.chain} WETH contract ABI or address is missing`);
  }
  const wethContract = new web3.eth.Contract(contract.abi, contract.address);
  const balanceRaw = await (wethContract.methods.balanceOf as any)(walletAddress).call() as string;
  const decimals = contract.decimals ?? 18;
  const divisor = 10 ** decimals;
  return Math.round((Number(balanceRaw) / divisor) * 1e8) / 1e8;
}

async function getNativeValue(chain: string, walletAddress: string): Promise<number> {
  const balance = await getNativeBalance(chain, walletAddress);
  if (balance === 0) {
    return 0;
  }
  const price = await getEthPrice();
  return Math.round((balance * price) * 100) / 100;
}

async function getWethValue(contract: Contract, walletAddress: string): Promise<number> {
  const balance = await getWethBalance(contract, walletAddress);
  if (balance === 0) {
    return 0;
  }
  const price = await getEthPrice();
  return Math.round((balance * price) * 100) / 100;
}

// Ethereum
async function getEthNativeBalance(walletAddress: string): Promise<number> {
  return getNativeBalance(ethWeth.chain, walletAddress);
}

async function getEthWethBalance(walletAddress: string): Promise<number> {
  return getWethBalance(ethWeth, walletAddress);
}

async function getEthNativeValue(walletAddress: string): Promise<number> {
  return getNativeValue(ethWeth.chain, walletAddress);
}

async function getEthWethValue(walletAddress: string): Promise<number> {
  return getWethValue(ethWeth, walletAddress);
}

// Optimism
async function getOpNativeBalance(walletAddress: string): Promise<number> {
  return getNativeBalance(opWeth.chain, walletAddress);
}

async function getOpWethBalance(walletAddress: string): Promise<number> {
  return getWethBalance(opWeth, walletAddress);
}

async function getOpNativeValue(walletAddress: string): Promise<number> {
  return getNativeValue(opWeth.chain, walletAddress);
}

async function getOpWethValue(walletAddress: string): Promise<number> {
  return getWethValue(opWeth, walletAddress);
}

// Base
async function getBaseNativeBalance(walletAddress: string): Promise<number> {
  return getNativeBalance(baseWeth.chain, walletAddress);
}

async function getBaseWethBalance(walletAddress: string): Promise<number> {
  return getWethBalance(baseWeth, walletAddress);
}

async function getBaseNativeValue(walletAddress: string): Promise<number> {
  return getNativeValue(baseWeth.chain, walletAddress);
}

async function getBaseWethValue(walletAddress: string): Promise<number> {
  return getWethValue(baseWeth, walletAddress);
}

// Arbitrum
async function getArbNativeBalance(walletAddress: string): Promise<number> {
  return getNativeBalance(arbWeth.chain, walletAddress);
}

async function getArbWethBalance(walletAddress: string): Promise<number> {
  return getWethBalance(arbWeth, walletAddress);
}

async function getArbNativeValue(walletAddress: string): Promise<number> {
  return getNativeValue(arbWeth.chain, walletAddress);
}

async function getArbWethValue(walletAddress: string): Promise<number> {
  return getWethValue(arbWeth, walletAddress);
}

// Aggregate
async function getTotalEthBalance(walletAddress: string): Promise<number> {
  const [
    ethNative,
    ethWethBal,
    opNative,
    opWethBal,
    baseNative,
    baseWethBal,
    arbNative,
    arbWethBal,
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

  const total = ethNative + ethWethBal + opNative + opWethBal + baseNative + baseWethBal + arbNative + arbWethBal;
  return Math.round(total * 1e8) / 1e8;
}

async function getTotalEthValue(walletAddress: string): Promise<number> {
  const [
    ethNativeValue,
    ethWethValue,
    opNativeValue,
    opWethValue,
    baseNativeValue,
    baseWethValue,
    arbNativeValue,
    arbWethValue,
  ] = await Promise.all([
    getEthNativeValue(walletAddress),
    getEthWethValue(walletAddress),
    getOpNativeValue(walletAddress),
    getOpWethValue(walletAddress),
    getBaseNativeValue(walletAddress),
    getBaseWethValue(walletAddress),
    getArbNativeValue(walletAddress),
    getArbWethValue(walletAddress),
  ]);

  const total = ethNativeValue + ethWethValue + opNativeValue + opWethValue + baseNativeValue + baseWethValue + arbNativeValue + arbWethValue;
  return Math.round(total * 100) / 100;
}

export {
  getEthPrice,
  getEthNativeBalance,
  getEthWethBalance,
  getEthNativeValue,
  getEthWethValue,
  getOpNativeBalance,
  getOpWethBalance,
  getOpNativeValue,
  getOpWethValue,
  getBaseNativeBalance,
  getBaseWethBalance,
  getBaseNativeValue,
  getBaseWethValue,
  getArbNativeBalance,
  getArbWethBalance,
  getArbNativeValue,
  getArbWethValue,
  getTotalEthBalance,
  getTotalEthValue,
};
