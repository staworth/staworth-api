import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const ethNxm = typedContracts.ethNxm!;
const nxmStakingNft = typedContracts.nxmStakingNFT!;

// Types
interface NxmStakingMetadata {
  name: string;
  description: string;
  image: string;
}

// ETH NXM Functions

async function getEthNxmBalance(walletAddress: string): Promise<number> {
    const web3 = getWeb3(ethNxm.chain);
    if (!ethNxm?.abi || !ethNxm?.address) {
        throw new Error('Error: ethNxm contract ABI or address is missing');
    }
    const ethNxmContract = new web3.eth.Contract(ethNxm.abi, ethNxm.address);
    const balanceRaw = await (ethNxmContract.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getNxmPrice(): Promise<number> {
    if (!ethNxm?.price_symbol || !ethNxm?.price_source) {
        throw new Error('Error: NXM price symbol or source is missing from contracts config');
    }
    const price = await getPrice(ethNxm.price_symbol, ethNxm.price_source);
    return price;
}

async function getEthNxmValue(walletAddress: string): Promise<number> {
    const balance = await getEthNxmBalance(walletAddress);
    if (balance === 0) {
        return 0;
    }
    const price = await getNxmPrice();
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

// NXM Staking NFT Functions

async function getNxmStakingNftUri( tokenId: number ): Promise<NxmStakingMetadata> {
    const web3 = getWeb3(nxmStakingNft.chain);
    if (!nxmStakingNft?.abi || !nxmStakingNft?.address) {
        throw new Error('Error: nxmStakingNft contract ABI or address is missing');
    }
    const nxmStakingNftContract = new web3.eth.Contract(nxmStakingNft.abi, nxmStakingNft.address);
    const uriRaw = await (nxmStakingNftContract.methods.tokenURI as any)(tokenId).call() as string;
    const encodedData = uriRaw.split(',')[1];
    if (!encodedData) {
        throw new Error('Error: encodedData is undefined');
    }
    const jsonString = Buffer.from(encodedData, 'base64').toString('utf-8');
    const uri = JSON.parse(jsonString) as NxmStakingMetadata;
    return uri;
}

async function getStakedNxmBalance( tokenId: number ): Promise<number> {
    const metadata = await getNxmStakingNftUri(tokenId);
    
    // Extract staked amount and pending rewards from description
    const stakedMatch = metadata.description.match(/Staked amount: ([\d.]+) NXM/);
    const rewardsMatch = metadata.description.match(/Pending rewards: ([\d.]+) NXM/);
    
    const staked = stakedMatch ? parseFloat(stakedMatch[1]!) : 0;
    const rewards = rewardsMatch ? parseFloat(rewardsMatch[1]!) : 0;
    
    return staked + rewards;
}

async function getStakedNxmValue( tokenId: number ): Promise<number> {
    const totalNxm = await getStakedNxmBalance(tokenId);
    const nxmPrice = await getNxmPrice();
    const totalValue = parseFloat((totalNxm * nxmPrice).toFixed(2));
    return totalValue;
}

// Aggregate Functions

async function getTotalNxmBalance( walletAddress: string, stakingTokenId: number ): Promise<number> {
    const ethNxmBalance = await getEthNxmBalance(walletAddress);
    const stakedNxmBalance = await getStakedNxmBalance(stakingTokenId);
    return ethNxmBalance + stakedNxmBalance;
}

async function getTotalNxmValue( walletAddress: string, stakingTokenId: number ): Promise<number> {
    const ethNxmValue = await getEthNxmValue(walletAddress);
    const stakedNxmValue = await getStakedNxmValue(stakingTokenId);
    return ethNxmValue + stakedNxmValue;
}

export {
    getEthNxmBalance,
    getEthNxmValue,
    getNxmPrice,
    getNxmStakingNftUri,
    getStakedNxmBalance,
    getStakedNxmValue,
    getTotalNxmBalance,
    getTotalNxmValue
};