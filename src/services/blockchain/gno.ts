import { Web3 } from 'web3';
import contracts from '../../utils/contracts.json' with { type: 'json' };

const { abi: ethGnoAbi, address: ethGnoAddress } = contracts.ethGno ?? {};
const { abi: gnoGnoAbi, address: gnoGnoAddress } = contracts.gnoGno ?? {};
const { abi: gnoOsGnoAbi, address: gnoOsGnoAddress } = contracts.gnoOsGno ?? {};
const { abi: gnoOsGnoGenesisVaultAbi, address: gnoOsGnoGenesisVaultAddress } = contracts.gnoOsGnoGenesisVault ?? {};

// ETH GNO Functions

async function getEthGnoBalance(walletAddress: string): Promise<number> {
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!ethGnoAbi || !ethGnoAddress) {
        throw new Error('Error: ethGno contract ABI or address is missing');
    }
    const ethGno = new web3.eth.Contract(ethGnoAbi as any[], ethGnoAddress);
    const balanceRaw = await (ethGno.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getGnoPrice(): Promise<number> {
    const response = await fetch(`https://api.beefy.finance/prices`);
    const data = await response.json() as { GNO: number };
    return data.GNO;
}

async function getEthGnoValue(walletAddress: string): Promise<number> {
    const balance = await getEthGnoBalance(walletAddress);
    if (balance === 0) {
        return 0;
    }
    const price = await getGnoPrice();
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

// Gnosis GNO Functions

async function getGnoGnoBalance(walletAddress: string): Promise<number> {
    const web3 = new Web3(`https://gnosis-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!gnoGnoAbi || !gnoGnoAddress) {
        throw new Error('Error: gnoGno contract ABI or address is missing');
    }
    const gnoGno = new web3.eth.Contract(gnoGnoAbi as any[], gnoGnoAddress);
    const balanceRaw = await (gnoGno.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getGnoGnoValue(walletAddress: string): Promise<number> {
    const balance = await getGnoGnoBalance(walletAddress);
    if (balance === 0) {
        return 0;
    }
    const price = await getGnoPrice();
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

// Gnosis osGNO Functions

async function getGnoOsGnoBalance( walletAddress: string ): Promise<number> {
    const web3 = new Web3(`https://gnosis-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!gnoOsGnoAbi || !gnoOsGnoAddress) {
        throw new Error('Error: gnoOsGno contract ABI or address is missing');
    }
    console.log(gnoOsGnoAddress)
    const gnoOsGno = new web3.eth.Contract(gnoOsGnoAbi as any[], gnoOsGnoAddress);
    const balanceRaw = await (gnoOsGno.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getOsGnoPpfs(): Promise<number> {
    const web3 = new Web3(`https://gnosis-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!gnoOsGnoGenesisVaultAbi || !gnoOsGnoGenesisVaultAddress) {
        throw new Error('Error: gnoOsGnoGenesisVault contract ABI or address is missing');
    }
    const gnoOsGnoVault = new web3.eth.Contract(gnoOsGnoGenesisVaultAbi as any[], gnoOsGnoGenesisVaultAddress);
    const ppfs = await (gnoOsGnoVault.methods.convertToAssets as any)(1e18).call() as string;
    return Number(ppfs) / 1e18;
}

async function getOsGnoGnoBalance( walletAddress: string ): Promise<number> {
    const osGnoBalance = await getGnoOsGnoBalance(walletAddress);
    const ppfs = await getOsGnoPpfs();
    const gnoBalance = Math.round((osGnoBalance * ppfs) * 1000) / 1000;
    return gnoBalance;
}

async function getOsGnoPrice(): Promise<number> {
    const gnoPrice = await getGnoPrice();
    const ppfs = await getOsGnoPpfs();
    const osGnoPrice = Math.round((gnoPrice / ppfs) * 100) / 100;
    return osGnoPrice;
}

async function getGnoOsGnoValue(walletAddress: string): Promise<number> {
    const balance = await getGnoOsGnoBalance(walletAddress);
    if (balance === 0) {
        return 0;
    }
    const price = await getOsGnoPrice();
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

// Aggregate Functions

async function getTotalGnoBalance(walletAddress: string): Promise<number> {
    const [ethGnoBalance, gnoGnoBalance, osGnoGnoBalance] = await Promise.all([
        getEthGnoBalance(walletAddress),
        getGnoGnoBalance(walletAddress),
        getOsGnoGnoBalance(walletAddress),
    ]);
    return Math.round((ethGnoBalance + gnoGnoBalance + osGnoGnoBalance) * 1000) / 1000;
}

async function getTotalGnoValue(walletAddress: string): Promise<number> {
    const [ethGnoValue, gnoGnoValue, osGnoGnoValue] = await Promise.all([
        getEthGnoValue(walletAddress),
        getGnoGnoValue(walletAddress),
        getGnoOsGnoValue(walletAddress),
    ]);
    return Math.round((ethGnoValue + gnoGnoValue + osGnoGnoValue) * 100) / 100;
}

export {
    getEthGnoBalance,
    getEthGnoValue,
    getGnoGnoBalance,
    getGnoGnoValue,
    getOsGnoGnoBalance,
    getGnoOsGnoValue,
    getTotalGnoBalance,
    getTotalGnoValue,
};