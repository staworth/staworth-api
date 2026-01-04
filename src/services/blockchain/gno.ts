import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const ethGno = typedContracts.ethGno!;
const gnoGno = typedContracts.gnoGno!;
const gnoOsGno = typedContracts.gnoOsGno!;
const gnoOsGnoGenesisVault = typedContracts.gnoOsGnoGenesisVault!;

// ETH GNO Functions

async function getEthGnoBalance(walletAddress: string): Promise<number> {
    const web3 = getWeb3(ethGno.chain);
    if (!ethGno?.abi || !ethGno?.address) {
        throw new Error('Error: ethGno contract ABI or address is missing');
    }
    const ethGnoContract = new web3.eth.Contract(ethGno.abi, ethGno.address);
    const balanceRaw = await (ethGnoContract.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getGnoPrice(): Promise<number> {
    if (!ethGno?.price_symbol || !ethGno?.price_source) {
        throw new Error('Error: GNO price symbol or source is missing from contracts config');
    }
    const price = await getPrice(ethGno.price_symbol, ethGno.price_source);
    return price;
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
    const web3 = getWeb3(gnoGno.chain);
    if (!gnoGno?.abi || !gnoGno?.address) {
        throw new Error('Error: gnoGno contract ABI or address is missing');
    }
    const gnoGnoContract = new web3.eth.Contract(gnoGno.abi, gnoGno.address);
    const balanceRaw = await (gnoGnoContract.methods.balanceOf as any)(walletAddress).call() as string;
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
    const web3 = getWeb3(gnoOsGno.chain);
    if (!gnoOsGno?.abi || !gnoOsGno?.address) {
        throw new Error('Error: gnoOsGno contract ABI or address is missing');
    }
    const gnoOsGnoContract = new web3.eth.Contract(gnoOsGno.abi, gnoOsGno.address);
    const balanceRaw = await (gnoOsGnoContract.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getOsGnoPpfs(): Promise<number> {
    const web3 = getWeb3(gnoOsGnoGenesisVault.chain);
    if (!gnoOsGnoGenesisVault?.abi || !gnoOsGnoGenesisVault?.address) {
        throw new Error('Error: gnoOsGnoGenesisVault contract ABI or address is missing');
    }
    const gnoOsGnoVaultContract = new web3.eth.Contract(gnoOsGnoGenesisVault.abi, gnoOsGnoGenesisVault.address);
    const ppfs = await (gnoOsGnoVaultContract.methods.convertToAssets as any)(1e18).call() as string;
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