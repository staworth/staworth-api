import { describe, it, expect } from 'vitest';
import { updatePortfolio } from './portfolioUpdater.js';

describe('Portfolio Updater', () => {
    describe('updatePortfolio', () => {
        it('should aggregate balances and values across all accounts', async () => {
            const portfolio = await updatePortfolio();
            
            console.log('Total:', portfolio.total);
            
            // Check all positions are defined
            expect(portfolio.positions.bifi).toBeDefined();
            expect(portfolio.positions.gno).toBeDefined();
            expect(portfolio.positions.nxm).toBeDefined();
            expect(portfolio.positions.xdai).toBeDefined();
            expect(portfolio.total).toBeDefined();

            // Check balance and value fields exist
            expect(portfolio.positions.bifi!.balance).toBeDefined();
            expect(portfolio.positions.bifi!.value).toBeDefined();
            expect(portfolio.positions.gno!.balance).toBeDefined();
            expect(portfolio.positions.gno!.value).toBeDefined();
            expect(portfolio.positions.nxm!.balance).toBeDefined();
            expect(portfolio.positions.nxm!.value).toBeDefined();
            expect(portfolio.positions.xdai!.balance).toBeDefined();
            expect(portfolio.positions.xdai!.value).toBeDefined();
            expect(portfolio.total!.value).toBeDefined();
            
            // Check types are numbers
            expect(typeof portfolio.positions.bifi!.balance).toBe('number');
            expect(typeof portfolio.positions.bifi!.value).toBe('number');
            expect(typeof portfolio.positions.gno!.balance).toBe('number');
            expect(typeof portfolio.positions.gno!.value).toBe('number');
            expect(typeof portfolio.positions.nxm!.balance).toBe('number');
            expect(typeof portfolio.positions.nxm!.value).toBe('number');
            expect(typeof portfolio.positions.xdai!.balance).toBe('number');
            expect(typeof portfolio.positions.xdai!.value).toBe('number');
            expect(typeof portfolio.total!.value).toBe('number');
            
            // Check values are non-negative
            expect(portfolio.positions.bifi!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.bifi!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.gno!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.gno!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.nxm!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.nxm!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.xdai!.balance).toBeGreaterThanOrEqual(0);
            expect(portfolio.positions.xdai!.value).toBeGreaterThanOrEqual(0);
            expect(portfolio.total!.value).toBeGreaterThanOrEqual(0);
            
            // Check values are finite numbers
            expect(Number.isFinite(portfolio.positions.bifi!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.positions.bifi!.value)).toBe(true);
            expect(Number.isFinite(portfolio.positions.gno!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.positions.gno!.value)).toBe(true);
            expect(Number.isFinite(portfolio.positions.nxm!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.positions.nxm!.value)).toBe(true);
            expect(Number.isFinite(portfolio.positions.xdai!.balance)).toBe(true);
            expect(Number.isFinite(portfolio.positions.xdai!.value)).toBe(true);
            expect(Number.isFinite(portfolio.total!.value)).toBe(true);
        }, 60000); // 60 second timeout for API calls and file I/O
    });
});
