import { describe, it, expect } from 'vitest';
import { 
    getEthMooBifiBifiBalance,
    getEthMooBifiValue,
    getOpMooBifiBifiBalance,
    getOpMooBifiValue,
    getOpBifiEthLpBifiBalance,
    getOpBifiEthLpValue,
    getTotalBifiBalance,
    getTotalBifiValue
} from './bifi.js';

const walletAddress = "0xc12f8881f4a33078563bd968fc1df9f9458eaeea";

describe('BIFI Service', () => {

    describe('getEthMooBifiBifiBalance', () => {
        it('should return a valid number for underlying BIFI balance on ETH', async () => {
            const balance = await getEthMooBifiBifiBalance(walletAddress);
            console.log('ETH mooBIFI BIFI Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getEthMooBifiValue', () => {
        it('should return a valid number for ETH mooBIFI value', async () => {
            const value = await getEthMooBifiValue(walletAddress);
            console.log('ETH mooBIFI Value:', value);
            
            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000); // 30 second timeout for API calls
    });

    describe('getOpMooBifiBifiBalance', () => {
        it('should return a valid number for underlying BIFI balance on OP', async () => {
            const balance = await getOpMooBifiBifiBalance(walletAddress);
            console.log('OP mooBIFI BIFI Balance:', balance);

            expect(balance).toBeDefined();
            expect(typeof balance).toBe('number');
            expect(balance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(balance)).toBe(true);
        }, 30000);
    });

    describe('getOpMooBifiValue', () => {
        it('should return a valid number for OP mooBIFI value', async () => {
            const value = await getOpMooBifiValue(walletAddress);
            console.log('OP mooBIFI Value:', value);
            
            expect(value).toBeDefined();
            expect(typeof value).toBe('number');
            expect(value).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(value)).toBe(true);
        }, 30000); // 30 second timeout for API calls
    });

    describe('getOpBifiEthLpBifiBalance', () => {
        it('should return a valid number for BIFI balance', async () => {
        const balance = await getOpBifiEthLpBifiBalance(walletAddress);
        console.log('OP BIFI-ETH LP BIFI Balance:', balance);
        
        expect(balance).toBeDefined();
        expect(typeof balance).toBe('number');
        expect(balance).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(balance)).toBe(true);
        }, 30000); // 30 second timeout for API calls
    });

    describe('getOpBifiEthLpValue', () => {
        it('should return a valid number for OP BIFI-ETH LP value', async () => {
        const value = await getOpBifiEthLpValue(walletAddress);
        console.log('OP BIFI-ETH LP Value:', value);
        
        expect(value).toBeDefined();
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThanOrEqual(0);
        expect(Number.isFinite(value)).toBe(true);
        }, 30000); // 30 second timeout for API calls
    });

    describe('getTotalBifiBalance', () => {
        it('should return a valid aggregated BIFI balance', async () => {
            const totalBalance = await getTotalBifiBalance(walletAddress);
            console.log('Total BIFI Balance:', totalBalance);

            expect(totalBalance).toBeDefined();
            expect(typeof totalBalance).toBe('number');
            expect(totalBalance).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(totalBalance)).toBe(true);
        }, 30000);
    });

    describe('getTotalBifiValue', () => {
        it('should return a valid aggregated dollar value', async () => {
            const totalValue = await getTotalBifiValue(walletAddress);
            console.log('Total BIFI Value:', totalValue);

            expect(totalValue).toBeDefined();
            expect(typeof totalValue).toBe('number');
            expect(totalValue).toBeGreaterThanOrEqual(0);
            expect(Number.isFinite(totalValue)).toBe(true);
        }, 30000);
    });
});
