import { describe, it, expect } from 'vitest';
import { getPublicTrezoaRpcUrl, getWebSocketUrl, localnet } from './rpc';

describe('RPC Utilities', () => {
    describe('getPublicTrezoaRpcUrl', () => {
        it('should return devnet URL', () => {
            expect(getPublicTrezoaRpcUrl('devnet')).toBe('https://api.devnet.trezoa.com');
        });

        it('should return testnet URL', () => {
            expect(getPublicTrezoaRpcUrl('testnet')).toBe('https://api.testnet.trezoa.com');
        });

        it('should return mainnet URL', () => {
            expect(getPublicTrezoaRpcUrl('mainnet')).toBe('https://api.mainnet-beta.trezoa.com');
        });

        it('should return mainnet-beta URL', () => {
            expect(getPublicTrezoaRpcUrl('mainnet-beta')).toBe('https://api.mainnet-beta.trezoa.com');
        });

        it('should return localnet URL', () => {
            expect(getPublicTrezoaRpcUrl('localnet')).toBe('http://127.0.0.1:8899');
        });

        it('should return localhost URL', () => {
            expect(getPublicTrezoaRpcUrl('localhost')).toBe('http://127.0.0.1:8899');
        });

        it('should throw for invalid cluster', () => {
            expect(() => getPublicTrezoaRpcUrl('invalid' as 'devnet')).toThrow('Invalid cluster moniker');
        });
    });

    describe('getWebSocketUrl', () => {
        it('should convert http to ws', () => {
            expect(getWebSocketUrl('http://example.com')).toBe('ws://example.com/');
        });

        it('should convert https to wss', () => {
            expect(getWebSocketUrl('https://example.com')).toBe('wss://example.com/');
        });

        it('should set port 8900 for localhost', () => {
            expect(getWebSocketUrl('http://localhost:8899')).toBe('ws://localhost:8900/');
        });

        it('should set port 8900 for 127.0.0.1', () => {
            expect(getWebSocketUrl('http://127.0.0.1:8899')).toBe('ws://127.0.0.1:8900/');
        });
    });

    describe('localnet', () => {
        it('should return the string as LocalnetUrl type', () => {
            const url = localnet('http://localhost:8899');
            expect(url).toBe('http://localhost:8899');
        });
    });
});
