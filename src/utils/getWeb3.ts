import { Web3 } from 'web3';

export const getWeb3 = (chain: string): Web3 => {
  const network =
    chain === 'ethereum'
      ? 'eth'
      : chain === 'optimism'
        ? 'opt'
        : chain === 'gnosis'
          ? 'gnosis'
          : chain === 'base'
            ? 'base'
            : chain === 'arbitrum'
              ? 'arb'
              : chain === 'polygon'
                ? 'polygon'
                : null;

  if (!network) {
    throw new Error(`Unsupported chain "${String(chain)}" passed to getWeb3`);
  }

  const web3Instance = new Web3(
    `https://${network}-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_RPC_KEY}`
  );
  return web3Instance;
};
