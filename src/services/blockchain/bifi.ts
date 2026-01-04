import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const ethMooBifi = typedContracts.ethmooBIFI!;
const opMooBifi = typedContracts.opmooBIFI!;
const opBifiEthLp = typedContracts.opBifiEthLp!;

interface PpfsResponse {
  priceRows: Array<{
    price: number;
    utc_datetime: string;
  }>;
}

// ETH BIFI Functions

async function getBifiPrice(): Promise<number> {
  if (!ethMooBifi?.price_symbol || !ethMooBifi?.price_source) {
    throw new Error('Error: BIFI price symbol or source is missing from contracts config');
  }
  const price = await getPrice(ethMooBifi.price_symbol, ethMooBifi.price_source);
  return price;
}

// ETH mooBIFI Functions

async function getEthMooBifiBalance( walletAddress: string ): Promise<bigint> {
  const web3 = getWeb3(ethMooBifi.chain);
  if (!ethMooBifi?.abi || !ethMooBifi?.address) {
    throw new Error('Error: ethMooBifi contract ABI or address is missing');
  }
  const ethMooBifiContract = new web3.eth.Contract(ethMooBifi.abi, ethMooBifi.address);
  const balanceRaw = await (ethMooBifiContract.methods.balanceOf as any)(walletAddress).call() as string;
  return BigInt(balanceRaw);
}

async function getMooBifiPrice(): Promise<number> {
  if (!ethMooBifi?.price_symbol || !ethMooBifi?.price_source) {
    throw new Error('Error: mooBIFI price symbol or source is missing from contracts config');
  }
  const price = await getPrice(ethMooBifi.price_symbol, ethMooBifi.price_source);
  return price;
}

async function getEthMooBifiValue( walletAddress: string ): Promise<number> {
    const balance = await getEthMooBifiBalance( walletAddress );
    if (balance === 0n) {
        return 0;
    }
    const price = await getMooBifiPrice();
    const value = Math.round(((Number(balance) / 1e18) * price) * 100) / 100;
    return value;
}

// ETH mooBIFI (Underlying BIFI) Functions

async function getMooBifiPpfs(): Promise<number> {
  const web3 = getWeb3(ethMooBifi.chain);
  if (!ethMooBifi?.abi || !ethMooBifi?.address) {
    throw new Error('Error: ethMooBifi contract ABI or address is missing');
  }
  const ethMooBifiContract = new web3.eth.Contract(ethMooBifi.abi, ethMooBifi.address);
  const ppfs = await (ethMooBifiContract.methods.getPricePerFullShare as any)().call() as string;
    return Number(ppfs) / 1e18;
}

async function getEthMooBifiBifiBalance( walletAddress: string ): Promise<number> {
    const mooBifiBalance = await getEthMooBifiBalance( walletAddress );
    const ppfs = await getMooBifiPpfs();
    const bifiBalance = Math.round(((Number(mooBifiBalance) / 1e18) * ppfs) * 1000) / 1000;
    return bifiBalance;
}

// OP mooBIFI Functions

async function getOpMooBifiBalance( walletAddress: string ): Promise<bigint> {
  const web3 = getWeb3(opMooBifi.chain);
  if (!opMooBifi?.abi || !opMooBifi?.address) {
    throw new Error('Error: opMooBifi contract ABI or address is missing');
  }
  const opMooBifiContract = new web3.eth.Contract(opMooBifi.abi, opMooBifi.address);
  const balanceRaw = await (opMooBifiContract.methods.balanceOf as any)(walletAddress).call() as string;
  return BigInt(balanceRaw);
}

async function getOpMooBifiValue( walletAddress: string ): Promise<number> {
    const balance = await getOpMooBifiBalance( walletAddress );
    if (balance === 0n) {
        return 0;
    }
    const price = await getMooBifiPrice();
  const value = Math.round(((Number(balance) / 1e18) * price) * 100) / 100;
    return value;
}

// OP mooBIFI (Underlying BIFI)Functions

async function getOpMooBifiBifiBalance( walletAddress: string ): Promise<number> {
    const mooBifiBalance = await getOpMooBifiBalance( walletAddress );
    const ppfs = await getMooBifiPpfs();
    const bifiBalance = Math.round(((Number(mooBifiBalance) / 1e18) * ppfs) * 1000) / 1000;
    return bifiBalance;
}


// OP BIFI-ETH LP Functions

async function getOpBifiEthLpBalance( walletAddress: string ): Promise<bigint> {
    const web3 = getWeb3(opBifiEthLp.chain);
  if (!opBifiEthLp?.abi || !opBifiEthLp?.address) {
    throw new Error('Error: opBifiEthLp contract ABI or address is missing');
  }
  const opBifiEthLpContract = new web3.eth.Contract(opBifiEthLp.abi, opBifiEthLp.address);
  const balanceRaw = await (opBifiEthLpContract.methods.balanceOf as any)(walletAddress).call() as string;
  return BigInt(balanceRaw);
}

async function getOpBifiEthLpPrice(): Promise<number> {
  if (!opBifiEthLp?.price_symbol || !opBifiEthLp?.price_source) {
    throw new Error('Error: opBifiEthLp price symbol or source is missing from contracts config');
  }
  const price = await getPrice(opBifiEthLp.price_symbol, opBifiEthLp.price_source);
  return price;
}

async function getOpBifiEthLpPpfs(): Promise<number> {
  if (!opBifiEthLp?.price_symbol) {
    throw new Error('Error: opBifiEthLp price symbol is missing from contracts config');
  }
  if (!opBifiEthLp?.price_source) {
    throw new Error('Error: opBifiEthLp price source is missing from contracts config');
  }
  const ppfs = await getPrice(opBifiEthLp.price_symbol, opBifiEthLp.price_source);
  return ppfs;
}

async function getOpBifiEthLpValue( walletAddress: string ): Promise<number> {
  const balance = await getOpBifiEthLpBalance( walletAddress );
  if (balance === 0n) {
    return 0;
  }
  const price = await getOpBifiEthLpPrice();
  const ppfs = await getOpBifiEthLpPpfs();
  const value = Math.round(((Number(balance) / 1e18) * ppfs * price) * 100) / 100;
  return value;
}

// OP BIFI-ETH LP (Underlying BIFI) Functions

async function getOpBifiEthLpBifiValue( walletAddress: string ): Promise<number> {
  const value = await getOpBifiEthLpValue( walletAddress );
  return Math.round((value / 2) * 100) / 100;
}

async function getOpBifiEthLpBifiBalance( walletAddress: string ): Promise<number> {
    const value = await getOpBifiEthLpBifiValue( walletAddress );
    const price = await getBifiPrice();
    const balance = Math.round((value / price) * 1000) / 1000;
    return balance;
}

// Aggregate Functions

async function getTotalBifiBalance( walletAddress: string ): Promise<number> {
    const ethMooBifiBifiBalance = await getEthMooBifiBifiBalance( walletAddress );
    const opMooBifiBifiBalance = await getOpMooBifiBifiBalance( walletAddress );
    const opBifiEthLpBifiBalance = await getOpBifiEthLpBifiBalance( walletAddress );
    const totalBifiBalance = Math.round((ethMooBifiBifiBalance + opMooBifiBifiBalance + opBifiEthLpBifiBalance) * 1000) / 1000;
    return totalBifiBalance;
}

async function getTotalBifiValue( walletAddress: string ): Promise<number> {
    const ethMooBifiValue = await getEthMooBifiValue( walletAddress );
    const opMooBifiValue = await getOpMooBifiValue( walletAddress );
    const opBifiEthLpValue = await getOpBifiEthLpValue( walletAddress );
    const totalValue = Math.round((ethMooBifiValue + opMooBifiValue + opBifiEthLpValue) * 100) / 100;
    return totalValue;
}

export {
  getEthMooBifiBifiBalance,
  getEthMooBifiValue,
  getOpMooBifiBifiBalance,
  getOpMooBifiValue,
  getOpBifiEthLpBifiBalance,
  getOpBifiEthLpValue,
  getTotalBifiBalance,
  getTotalBifiValue,
};