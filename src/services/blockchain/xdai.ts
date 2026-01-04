import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const gnoSDai = typedContracts.gnoSDai!;

async function getDaiPrice(): Promise<number> {
    if (!gnoSDai?.price_symbol || !gnoSDai?.price_source) {
        throw new Error('Error: sDAI price symbol or source is missing from contracts config');
    }
    return getPrice(gnoSDai.price_symbol, gnoSDai.price_source);
}
// xDAI Functions

// sDAI Functions

async function getGnoSDaiBalance( walletAddress: string ): Promise<number> {
    const web3 = getWeb3(gnoSDai.chain);
    if (!gnoSDai?.abi || !gnoSDai?.address) {
        throw new Error('Error: gnoSDai contract ABI or address is missing');
    }
    const gnoSDaiContract = new web3.eth.Contract(gnoSDai.abi, gnoSDai.address);
    const balanceRaw = await (gnoSDaiContract.methods.balanceOf as any)(walletAddress).call() as string;
    const decimals = gnoSDai.decimals ?? 18;
    const divisor = 10 ** decimals;
    return Math.round((Number(balanceRaw) / divisor) * 1000) / 1000;
}

async function getGnoSDaiValue( walletAddress: string ): Promise<number> {
    const balance = await getGnoSDaiBalance( walletAddress );
    if (balance === 0) {
        return 0;
    }
    const price = await getDaiPrice();
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

// Aggregate Functions

async function getTotalxDaiBalance( walletAddress: string ): Promise<number> {
    const gnoSDaiBalance = await getGnoSDaiBalance( walletAddress );
    const totalBalance = Math.round((gnoSDaiBalance) * 1000) / 1000;
    return totalBalance;
}

async function getTotalxDaiValue( walletAddress: string ): Promise<number> {
    const gnoSDaiValue = await getGnoSDaiValue( walletAddress );
    const totalValue = Math.round((gnoSDaiValue) * 100) / 100;
    return totalValue;
}

export {
    getGnoSDaiBalance,
    getGnoSDaiValue,
    getTotalxDaiBalance,
    getTotalxDaiValue
};