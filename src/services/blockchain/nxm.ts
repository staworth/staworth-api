import { Web3 } from 'web3';
import contracts from '../../utils/contracts.json' with { type: 'json' };

const { abi: ethNxmAbi, address: ethNxmAddress } = contracts.ethNxm ?? {};
const { abi: nxmStakingNftAbi, address: nxmStakingNftAddress } = contracts.nxmStakingNFT ?? {};

// Types
interface NxmStakingMetadata {
  name: string;
  description: string;
  image: string;
}

// ETH NXM Functions

async function getEthNxmBalance(walletAddress: string): Promise<number> {
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!ethNxmAbi || !ethNxmAddress) {
        throw new Error('Error: ethNxm contract ABI or address is missing');
    }
    const ethNxm = new web3.eth.Contract(ethNxmAbi as any[], ethNxmAddress);
    const balanceRaw = await (ethNxm.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balanceRaw) / 1e18) * 1000) / 1000;
}

async function getNxmPrice(): Promise<number> {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&symbols=nxm');
    const data = await response.json() as { nxm: { usd: number } };
    const price = data.nxm.usd;
    console.log(`NXM Price: $${price}`);
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
    const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`);
    if (!nxmStakingNftAbi || !nxmStakingNftAddress) {
        throw new Error('Error: nxmStakingNft contract ABI or address is missing');
    }
    const nxmStakingNft = new web3.eth.Contract(nxmStakingNftAbi as any[], nxmStakingNftAddress);
    const uriRaw = await (nxmStakingNft.methods.tokenURI as any)(tokenId).call() as string;
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
    
    console.log(`Staked: ${staked}`);
    console.log(`Rewards: ${rewards}`);
    
    return staked + rewards;
}

async function getStakedNxmValue( tokenId: number ): Promise<number> {
    const totalNxm = await getStakedNxmBalance(tokenId);
    const nxmPrice = await getNxmPrice();
    const totalValue = parseFloat((totalNxm * nxmPrice).toFixed(2));
    console.log(`Total NXM Value: $${totalValue.toFixed(2)}`);
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