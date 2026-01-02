import { Web3 } from 'web3';
import contracts from '../../utils/contracts.json' with { type: 'json' };

const { abi: ethMooBifiAbi, address: ethMooBifiAddress } = contracts.ethMooBifi ?? {};
const { abi: opMooBifiAbi, address: opMooBifiAddress } = contracts.opMooBifi ?? {};
const { abi: opBifiEthLpAbi, address: opBifiEthLpAddress } = contracts.opBifiEthLp ?? {};

interface PriceDataPoint {
  v: number;
  t: number;
}

interface PpfsResponse {
  priceRows: Array<{
    price: number;
    utc_datetime: string;
  }>;
}

// ETH BIFI Functions

async function getBifiPrice(): Promise<number> {
  const response = await fetch(`https://api.beefy.finance/prices`);
  if (!response.ok) {
    throw new Error(`Error fetching BIFI price: ${response.status} ${response.statusText}`);
  }
  const data = await response.json() as { BIFI: number };
  return data.BIFI;
}

// ETH mooBIFI Functions

async function getEthMooBifiBalance( walletAddress: string ): Promise<bigint> {
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!ethMooBifiAbi || !ethMooBifiAddress) {
        throw new Error('Error: ethMooBifi contract ABI or address is missing');
    }
    const ethMooBifi = new web3.eth.Contract(ethMooBifiAbi as any[], ethMooBifiAddress);
    const balanceRaw = await (ethMooBifi.methods.balanceOf as any)(walletAddress).call() as string;
    return BigInt(balanceRaw);
}

async function getMooBifiPrice(): Promise<number> {
    const response = await fetch(`https://api.beefy.finance/prices`);
    const data = await response.json() as { mooBIFI: number };
    return data.mooBIFI;
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
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!ethMooBifiAbi || !ethMooBifiAddress) {
        throw new Error('Error: ethMooBifi contract ABI or address is missing');
    }
    const ethMooBifi = new web3.eth.Contract(ethMooBifiAbi as any[], ethMooBifiAddress);
    const ppfs = await (ethMooBifi.methods.getPricePerFullShare as any)().call() as string;
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
  const web3 = new Web3(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
  if (!opMooBifiAbi || !opMooBifiAddress) {
    throw new Error('Error: opMooBifi contract ABI or address is missing');
  }
  const opMooBifi = new web3.eth.Contract(opMooBifiAbi as any[], opMooBifiAddress);
  const balanceRaw = await (opMooBifi.methods.balanceOf as any)(walletAddress).call() as string;
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
    const web3 = new Web3(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
  if (!opBifiEthLpAbi || !opBifiEthLpAddress) {
    throw new Error('Error: opBifiEthLp contract ABI or address is missing');
  }
  const opBifiEthLp = new web3.eth.Contract(opBifiEthLpAbi as any[], opBifiEthLpAddress);
  const balanceRaw = await (opBifiEthLp.methods.balanceOf as any)(walletAddress).call() as string;
  return BigInt(balanceRaw);
}

async function getOpBifiEthLpPrice(): Promise<number> {
  const headers = { 'Authorization': `Bearer ${process.env.BEEFY_API_KEY}` };
  const response = await fetch("https://data.beefy.finance/api/v2/prices?oracle=velodrome-v2-weth-moobifi&bucket=1h_1M", { headers });
  const data = await response.json() as PriceDataPoint[];
  const pair = data[data.length - 1];
  if (!pair) {
    throw new Error("Error: Beefy API failed to return a price");
  }
  return pair.v;
}

async function getOpBifiEthLpPpfs(): Promise<number> {
  const headers = { 'Authorization': `Bearer ${process.env.DATABARN_API_KEY}` };
  const utcDatetime = new Date().toISOString();
  const getUrl = `https://db-core.beefy.com/api/v1/price/around-a-date?price_type=share_to_underlying&oracle_id=velodrome-v2-weth-moobifi&utc_datetime=${utcDatetime}&look_around=1day&half_limit=1`;
  const response = await fetch(getUrl, { headers });
  const data = await response.json() as PpfsResponse;
  const firstRow = data.priceRows[0];
  if (!firstRow) {
    throw new Error("Error: Databarn API failed to return a PPFS value");
  }
  const ppfs = firstRow.price;
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