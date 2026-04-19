import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contract, Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const BASE_ASSET_CONTRACTS = ['baseCbEth', 'baseCbBtc', 'baseEzEth', 'baseWeEth'] as const;

type BaseAssetContractName = typeof BASE_ASSET_CONTRACTS[number];

function normalizeAbi(contractName: string, abi: unknown): Contract['abi'] {
  if (!Array.isArray(abi)) {
    throw new Error(`Error: ${contractName} ABI must be an array`);
  }

  const normalizedAbi = abi.length === 1 && Array.isArray(abi[0]) ? abi[0] : abi;
  const hasBalanceOf = normalizedAbi.some((item) => item?.type === 'function' && item?.name === 'balanceOf');

  if (!hasBalanceOf) {
    throw new Error(`Error: ${contractName} ABI does not include balanceOf`);
  }

  return normalizedAbi;
}

async function getBaseAssetBalance(
  contractName: string,
  contract: Contract,
  walletAddress: string
): Promise<number> {
  const web3 = getWeb3(contract.chain);
  if (!contract?.abi || !contract?.address) {
    throw new Error(`Error: ${contractName} contract ABI or address is missing`);
  }

  const tokenContract = new web3.eth.Contract(normalizeAbi(contractName, contract.abi), contract.address);
  const balanceRaw = await (tokenContract.methods.balanceOf as any)(walletAddress).call() as string;
  return Math.round((Number(balanceRaw) / Math.pow(10, contract.decimals)) * 1e18) / 1e18;
}

async function getBaseAssetValue(
  contractName: string,
  contract: Contract,
  walletAddress: string
): Promise<number> {
  if (!contract?.price_symbol || !contract?.price_source) {
    throw new Error(`Error: ${contractName} price symbol or source is missing from contracts config`);
  }

  const balance = await getBaseAssetBalance(contractName, contract, walletAddress);
  if (balance === 0) {
    return 0;
  }

  const price = await getPrice(contract.price_symbol, contract.price_source);
  return Math.round((balance * price) * 100) / 100;
}

async function getBaseAssetPositions(
  walletAddress: string
): Promise<Record<BaseAssetContractName, { balance: number; value: number }>> {
  const result = {} as Record<BaseAssetContractName, { balance: number; value: number }>;

  for (const contractName of BASE_ASSET_CONTRACTS) {
    const contract = typedContracts[contractName];
    if (!contract) {
      throw new Error(`Error: ${contractName} contract config is missing`);
    }

    const balance = await getBaseAssetBalance(contractName, contract, walletAddress);
    const value = await getBaseAssetValue(contractName, contract, walletAddress);
    result[contractName] = { balance, value };
  }

  return result;
}

export {
  getBaseAssetBalance,
  getBaseAssetValue,
  getBaseAssetPositions,
};
export type {
  BaseAssetContractName,
};
