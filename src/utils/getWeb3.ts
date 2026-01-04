import { Web3 } from 'web3';

export const getWeb3 = (chain: string): Web3 => {
  const web3Instance = new Web3(
    `https://${chain === 'ethereum' ? 'eth' : chain === 'optimism' ? 'opt' : chain === 'gnosis' ? 'gnosis' : 'base'}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`
  );
  return web3Instance;
};