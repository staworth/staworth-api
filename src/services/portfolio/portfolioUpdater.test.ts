import { describe, it, expect } from 'vitest';
import { updatePortfolio } from './portfolioUpdater.js';

describe('Portfolio Updater', () => {
    describe('updatePortfolio', () => {
        it('should aggregate balances and values across all accounts', async () => {
            const portfolio = await updatePortfolio();
            
            console.log('Updated BIFI:', portfolio.bifi);
            console.log('Updated GNO:', portfolio.gno);
            console.log('Updated NXM:', portfolio.nxm);
            console.log('Total:', portfolio.total);
            
            expect(portfolio.bifi).toBeDefined();
            expect(portfolio.gno).toBeDefined();
            expect(portfolio.nxm).toBeDefined();
            expect(portfolio.total).toBeDefined();

            expect(portfolio.bifi.balance).toBeDefined();
            expect(portfolio.bifi.value).toBeDefined();
            expect(portfolio.gno?.balance).toBeDefined();
            expect(portfolio.gno?.value).toBeDefined();
            expect(portfolio.nxm?.balance).toBeDefined();
            expect(portfolio.nxm?.value).toBeDefined();
            expect(portfolio.total?.value).toBeDefined();
            
            expect(typeof portfolio.bifi.balance).toBe('number');
            expect(typeof portfolio.bifi.value).toBe('number');
            expect(typeof portfolio.gno?.balance).toBe('number');
            expect(typeof portfolio.gno?.value).toBe('number');
            expect(typeof portfolio.nxm?.balance).toBe('number');
            expect(typeof portfolio.nxm?.value).toBe('number');
            expect(typeof portfolio.total?.value).toBe('number');
            
            expect(portfolio.bifi.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.bifi.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.gno!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.gno!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.nxm!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.nxm!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.total!.value).toBeGreaterThanOrEqual(0);
            
            expect(Number.isFinite(portfolio.bifi.balance)).toBe(true);
            expect(Number.isFinite(portfolio.bifi.value)).toBe(true);
            expect(Number.isFinite(portfolio.gno!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.gno!.value)).toBe(true);
            expect(Number.isFinite(portfolio.nxm!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.nxm!.value)).toBe(true);
            expect(Number.isFinite(portfolio.total!.value)).toBe(true);
        }, 60000); // 60 second timeout for API calls and file I/O
    });
});
