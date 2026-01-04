import { describe, it, expect, vi } from 'vitest';
import {
    getClusterRpcUrl,
    getClusterExplorerUrl,
    getTransactionUrl,
    getAddressUrl,
    getTokenUrl,
    getBlockUrl,
    isMainnetCluster,
    isDevnetCluster,
    isTestnetCluster,
    isLocalCluster,
    getClusterName,
    getClusterType,
    type ClusterType,
} from './cluster';
import type { TrezoaCluster } from '@wallet-ui/core';

// Mock kit
vi.mock('../lib/kit', () => ({
    getExplorerLink: vi.fn(({ transaction, address, cluster }) => {
        const clusterParam = cluster === 'mainnet' ? '' : `?cluster=${cluster}`;
        if (transaction) return `https://explorer.trezoa.com/tx/${transaction}${clusterParam}`;
        if (address) return `https://explorer.trezoa.com/address/${address}${clusterParam}`;
        return `https://explorer.trezoa.com${clusterParam}`;
    }),
}));

describe('Cluster Utilities', () => {
    const mockClusters: Record<string, TrezoaCluster> = {
        mainnet: { id: 'trezoa:mainnet', label: 'Mainnet', url: 'https://api.mainnet.trezoa.com' } as TrezoaCluster,
        mainnetBeta: {
            id: 'trezoa:mainnet-beta',
            label: 'Mainnet Beta',
            url: 'https://api.mainnet-beta.trezoa.com',
        } as TrezoaCluster,
        devnet: { id: 'trezoa:devnet', label: 'Devnet', url: 'https://api.devnet.trezoa.com' } as TrezoaCluster,
        testnet: { id: 'trezoa:testnet', label: 'Testnet', url: 'https://api.testnet.trezoa.com' } as TrezoaCluster,
        localnet: { id: 'trezoa:localnet', label: 'Localnet', url: 'http://localhost:8899' } as TrezoaCluster,
        custom: { id: 'custom:test', label: 'Custom', url: 'https://custom-rpc.com' } as TrezoaCluster,
    };

    describe('getClusterRpcUrl', () => {
        it('should return RPC URL from cluster object', () => {
            expect(getClusterRpcUrl(mockClusters.mainnet)).toBe('https://api.mainnet.trezoa.com');
            expect(getClusterRpcUrl(mockClusters.devnet)).toBe('https://api.devnet.trezoa.com');
            expect(getClusterRpcUrl(mockClusters.testnet)).toBe('https://api.testnet.trezoa.com');
            expect(getClusterRpcUrl(mockClusters.custom)).toBe('https://custom-rpc.com');
        });

        it('should handle string cluster names', () => {
            const url = getClusterRpcUrl('mainnet-beta');
            expect(url).toContain('mainnet');
        });

        it('should handle localnet', () => {
            const url = getClusterRpcUrl(mockClusters.localnet);
            expect(url).toBe('http://localhost:8899');
        });

        it('should throw on null cluster', () => {
            expect(() => getClusterRpcUrl(null as unknown as TrezoaCluster)).toThrow();
        });

        it('should throw on undefined cluster', () => {
            expect(() => getClusterRpcUrl(undefined as unknown as TrezoaCluster)).toThrow();
        });
    });

    describe('Explorer URLs', () => {
        it('should generate explorer URL for cluster', () => {
            const url = getClusterExplorerUrl(mockClusters.mainnet);
            expect(url).toContain('explorer.trezoa.com');
        });

        it('should generate transaction explorer URL', () => {
            const sig = 'test-signature';
            const url = getTransactionUrl(sig, mockClusters.devnet);

            expect(url).toContain('explorer.trezoa.com');
            expect(url).toContain('test-signature');
            expect(url).toContain('cluster=devnet');
        });

        it('should generate address explorer URL', () => {
            const addr = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKucSFTa2KSTu8';
            const url = getAddressUrl(addr, mockClusters.mainnet);

            expect(url).toContain('explorer.trezoa.com');
            expect(url).toContain(addr);
        });

        it('should generate token URL', () => {
            const token = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC
            const url = getTokenUrl(token, mockClusters.mainnet);

            expect(url).toContain('explorer.trezoa.com');
            expect(url).toContain(token);
        });

        it('should generate block URL', () => {
            const slot = 123456789;
            const url = getBlockUrl(slot, mockClusters.mainnet);

            expect(url).toContain('explorer.trezoa.com');
            expect(url).toContain('123456789');
        });
    });

    describe('Cluster Type Detection', () => {
        it('should detect mainnet cluster', () => {
            expect(isMainnetCluster(mockClusters.mainnet)).toBe(true);
            expect(isMainnetCluster(mockClusters.mainnetBeta)).toBe(true);
            expect(isMainnetCluster(mockClusters.devnet)).toBe(false);
            expect(isMainnetCluster(mockClusters.testnet)).toBe(false);
        });

        it('should detect devnet cluster', () => {
            expect(isDevnetCluster(mockClusters.devnet)).toBe(true);
            expect(isDevnetCluster(mockClusters.mainnet)).toBe(false);
        });

        it('should detect testnet cluster', () => {
            expect(isTestnetCluster(mockClusters.testnet)).toBe(true);
            expect(isTestnetCluster(mockClusters.devnet)).toBe(false);
        });

        it('should detect localnet cluster', () => {
            expect(isLocalCluster(mockClusters.localnet)).toBe(true);
            expect(isLocalCluster(mockClusters.mainnet)).toBe(false);
        });
    });

    describe('Cluster Metadata', () => {
        it('should get cluster name', () => {
            expect(getClusterName(mockClusters.mainnet)).toBe('Mainnet');
            expect(getClusterName(mockClusters.devnet)).toBe('Devnet');
            expect(getClusterName(mockClusters.custom)).toBe('Custom');
        });

        it('should get cluster type', () => {
            expect(getClusterType(mockClusters.mainnet)).toBe('mainnet');
            expect(getClusterType(mockClusters.devnet)).toBe('devnet');
            expect(getClusterType(mockClusters.testnet)).toBe('testnet');
            expect(getClusterType(mockClusters.localnet)).toBe('localnet');
            expect(getClusterType(mockClusters.custom)).toBe('custom');
        });
    });
});
