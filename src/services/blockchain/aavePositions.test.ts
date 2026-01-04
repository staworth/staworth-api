import { describe, expect, it } from 'vitest';
import { 
	getAaveV3Balance, 
	getAaveV3Value,
	getAaveV3Positions
 } from './aavePositions.js';
import contracts from '../../../data/contracts/contracts.json' with { type: 'json' };
import type { Contracts } from '../../types/contract.js';

const typedContracts = contracts as unknown as Contracts;
const aOptWstEth = typedContracts.aOptWstEth!;
const walletAddress = '0xc12F8881f4A33078563Bd968Fc1Df9F9458EaEEa';

// describe('getAaveV3Balance', () => {
// 	it('returns balance in token units rounded to 3 decimals', async () => {
// 		const contract = aOptWstEth;
// 		const balance = await getAaveV3Balance(contract, walletAddress);

// 		expect(balance).toBeDefined();
// 		expect(typeof balance).toBe('number');
// 		expect(balance).toBeGreaterThan(0);
// 		console.log(`Aave V3 Deposit Balance: ${balance}`);
// 	}, 30000);
// });

// describe('getAaveV3Value', () => {
// 	it('returns value as a number greater than or equal to 0', async () => {
// 		const contract = aOptWstEth;
// 		const value = await getAaveV3Value(contract, walletAddress);

// 		expect(value).toBeDefined();
// 		expect(typeof value).toBe('number');
// 		expect(value).toBeGreaterThanOrEqual(0);
// 		console.log(`wstETH Value: ${value}`);
// 	}, 30000);
// });

describe('getAaveV3Positions', () => {
	it('returns positions object with balances and values for all Aave V3 contracts', async () => {
		const positions = await getAaveV3Positions(walletAddress);

		expect(positions).toBeDefined();
		expect(typeof positions).toBe('object');
		expect(Object.keys(positions).length).toBeGreaterThan(0);

		for (const [contractName, position] of Object.entries(positions)) {
			expect(position.balance).toBeDefined();
			expect(typeof position.balance).toBe('number');
			expect(position.balance).toBeGreaterThanOrEqual(0);

			expect(position.value).toBeDefined();
			expect(typeof position.value).toBe('number');
			expect(position.value).toBeGreaterThanOrEqual(0);

			console.log(`Contract: ${contractName}, Balance: ${position.balance}, Value: ${position.value}`);
		}
	}, 60000);
});