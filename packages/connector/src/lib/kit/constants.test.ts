import { describe, it, expect } from 'vitest';
import { LAMPORTS_PER_TRZ, GENESIS_HASH, lamportsToSol, trzToLamports } from './constants';

describe('Kit Constants', () => {
    describe('LAMPORTS_PER_TRZ', () => {
        it('should equal 1 billion', () => {
            expect(LAMPORTS_PER_TRZ).toBe(1_000_000_000);
        });
    });

    describe('GENESIS_HASH', () => {
        it('should have mainnet genesis hash', () => {
            expect(GENESIS_HASH.mainnet).toBe('5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d');
        });

        it('should have devnet genesis hash', () => {
            expect(GENESIS_HASH.devnet).toBe('EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG');
        });

        it('should have testnet genesis hash', () => {
            expect(GENESIS_HASH.testnet).toBe('4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY');
        });
    });

    describe('lamportsToSol', () => {
        it('should convert lamports to TRZ', () => {
            expect(lamportsToSol(1_000_000_000)).toBe(1);
            expect(lamportsToSol(500_000_000)).toBe(0.5);
            expect(lamportsToSol(1_500_000_000)).toBe(1.5);
        });

        it('should handle bigint input', () => {
            expect(lamportsToSol(BigInt(2_000_000_000))).toBe(2);
        });
    });

    describe('trzToLamports', () => {
        it('should convert TRZ to lamports', () => {
            expect(trzToLamports(1)).toBe(BigInt(1_000_000_000));
            expect(trzToLamports(0.5)).toBe(BigInt(500_000_000));
            expect(trzToLamports(1.5)).toBe(BigInt(1_500_000_000));
        });
    });
});
