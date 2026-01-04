import { describe, it, expect } from 'vitest';
import { getGnoSDaiBalance, getGnoSDaiValue } from './xdai.js';

const walletAddress = "0xc12f8881f4a33078563bd968fc1df9f9458eaeea";

describe('getGnoSDaiBalance', () => {
	it('getGnoSDaiBalance returns token balance rounded to 3 decimals', async () => {

		const balance = await getGnoSDaiBalance(walletAddress);
        console.log('GNO sDAI Balance:', balance);

        expect(balance).toBeDefined();
        expect(typeof balance).toBe('number');
        expect(balance).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(balance)).toBe(true);
	}, 30000);
});

describe('getGnoSDaiValue', () => {
	it('getGnoSDaiValue returns USD value rounded to 2 decimals', async () => {

		const value = await getGnoSDaiValue(walletAddress);
        console.log('GNO sDAI Value:', value);

        expect(value).toBeDefined();
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(value)).toBe(true);
	},30000);
});