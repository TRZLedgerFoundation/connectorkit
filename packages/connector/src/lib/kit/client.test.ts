import { describe, it, expect, vi } from 'vitest';

vi.mock('@trezoa/kit', () => ({
    createTrezoaRpc: vi.fn(url => ({ url, __type: 'rpc' })),
    createTrezoaRpcSubscriptions: vi.fn(url => ({ url, __type: 'rpcSubscriptions' })),
}));

import { createTrezoaClient } from './client';

describe('Kit Client Factory', () => {
    describe('createTrezoaClient', () => {
        it('should create client from devnet moniker', () => {
            const client = createTrezoaClient({ urlOrMoniker: 'devnet' });
            expect(client.rpc).toBeDefined();
            expect(client.rpcSubscriptions).toBeDefined();
            expect(client.urlOrMoniker).toContain('devnet.trezoa.com');
        });

        it('should create client from mainnet moniker', () => {
            const client = createTrezoaClient({ urlOrMoniker: 'mainnet' });
            expect(client.urlOrMoniker).toContain('mainnet-beta.trezoa.com');
        });

        it('should create client from testnet moniker', () => {
            const client = createTrezoaClient({ urlOrMoniker: 'testnet' });
            expect(client.urlOrMoniker).toContain('testnet.trezoa.com');
        });

        it('should create client from localnet moniker', () => {
            const client = createTrezoaClient({ urlOrMoniker: 'localnet' });
            expect(client.urlOrMoniker).toContain('127.0.0.1');
        });

        it('should create client from URL string', () => {
            const client = createTrezoaClient({ urlOrMoniker: 'https://custom-rpc.example.com' });
            expect(client.urlOrMoniker).toBe('https://custom-rpc.example.com/');
        });

        it('should throw for missing urlOrMoniker', () => {
            expect(() => createTrezoaClient({ urlOrMoniker: '' })).toThrow('Cluster url or moniker is required');
        });

        it('should throw for invalid moniker', () => {
            expect(() => createTrezoaClient({ urlOrMoniker: 'invalid-moniker' })).toThrow(
                'Invalid URL or cluster moniker',
            );
        });

        it('should apply custom RPC port', () => {
            const client = createTrezoaClient({
                urlOrMoniker: 'https://custom-rpc.example.com',
                rpcConfig: { port: 9999 },
            });
            expect(client.urlOrMoniker).toContain(':9999');
        });
    });
});
