import { describe, it, expect } from 'vitest';
import {
    getEthGnoBalance,
    getEthGnoValue,
    getGnoGnoBalance,
    getGnoGnoValue,
    getOsGnoGnoBalance,
    getGnoOsGnoValue,
    getTotalGnoBalance,
    getTotalGnoValue,

} from './gno.js';

const walletAddress = "0xc12f8881f4a33078563bd968fc1df9f9458eaeea";

describe('GNO Service', () => {

    describe('getEthGnoBalance', () => {
        it('should return a valid number for ETH GNO balance', async () => {
            const balance = await getEthGnoBalance(walletAddress);
            console.log('ETH GNO Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getEthGnoValue', () => {
        it('should return a valid number for ETH GNO value', async () => {
            const value = await getEthGnoValue(walletAddress);
            console.log('ETH GNO Value:', value);

            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000);
    });

    describe('getGnoGnoBalance', () => {
        it('should return a valid number for Gnosis GNO balance', async () => {
            const balance = await getGnoGnoBalance(walletAddress);
            console.log('Gnosis GNO Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getGnoGnoValue', () => {
        it('should return a valid number for Gnosis GNO value', async () => {
            const value = await getGnoGnoValue(walletAddress);
            console.log('Gnosis GNO Value:', value);

            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000);
    });

    describe('getOsGnoGnoBalance', () => {
        it('should return a valid number for Gnosis osGNO balance', async () => {
            const balance = await getOsGnoGnoBalance(walletAddress);
            console.log('Gnosis osGNO GNO Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getGnoOsGnoValue', () => {
        it('should return a valid number for Gnosis osGNO value', async () => {
            const value = await getGnoOsGnoValue(walletAddress);
            console.log('Gnosis osGNO GNO Value:', value);

            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000);
    });

    describe('getTotalGnoBalance', () => {
        it('should return a valid aggregate GNO balance', async () => {
            const balance = await getTotalGnoBalance(walletAddress);
            console.log('Total GNO Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getTotalGnoValue', () => {
        it('should return a valid aggregate GNO value', async () => {
            const value = await getTotalGnoValue(walletAddress);
            console.log('Total GNO Value:', value);

            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000);
    });
});
