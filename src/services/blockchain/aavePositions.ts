import { getWeb3 } from '../../utils/getWeb3.js';
import { getPrice } from '../../utils/getPrice.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contract, Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const aOptWstEth = typedContracts.aOptWstEth!;

async function getAaveV3Balance(
  contract: Contract,
  walletAddress: string
): Promise<number> {
  const web3 = getWeb3(contract.chain);
  const aToken = new web3.eth.Contract(contract.abi, contract.address);
    if (!aToken.methods) {
        throw new Error('Failed to initialize contract methods');
    }
    
    if (!aToken.methods.balanceOf) {
        throw new Error('balanceOf method not found on contract');
    }
    
    const balance = await (aToken.methods.balanceOf as any)(walletAddress).call() as string;
    return Math.round((Number(balance) / Math.pow(10, contract.decimals)) * 1e18) / 1e18;
}

async function getAaveV3Value(
  contract: Contract,
  walletAddress: string
): Promise<number> {
    if (!contract?.price_symbol || !contract?.price_source) {
    throw new Error('Error: wstETH price symbol or source is missing from contracts config');
  }
    const balance = await getAaveV3Balance( contract, walletAddress );
    if (balance === 0) {
        return 0;
    }
    const price = await getPrice(contract.price_symbol, contract.price_source);
    const value = Math.round((balance * price) * 100) / 100;
    return value;
}

async function getAaveV3Positions (
  walletAddress: string
): Promise<Record<string, { balance: number; value: number }>> {
  const result: Record<string, { balance: number; value: number }> = {};
  for (const [contractName, contract] of Object.entries(typedContracts)) {
    if (contract?.defi_protocol === 'aave') {
      const balance = await getAaveV3Balance(contract, walletAddress);
      const value = await getAaveV3Value(contract, walletAddress);
      result[contractName] = { balance, value };
    }
  }
  
  return result;
}

export { 
  getAaveV3Balance, 
  getAaveV3Value,
  getAaveV3Positions
};