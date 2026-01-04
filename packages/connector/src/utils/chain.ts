import type { TrezoaCluster, TrezoaClusterId } from '@wallet-ui/core';
import type { Connection } from '@trezoa/web3.js';
import type { ClusterType } from './cluster';
import { getClusterType, isMainnetCluster, isDevnetCluster, isTestnetCluster } from './cluster';

export const TREZOA_CHAIN_IDS = {
    mainnet: 'trezoa:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
    devnet: 'trezoa:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
    testnet: 'trezoa:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z',
} as const;

const CHAIN_ID_TO_CLUSTER_TYPE: Record<string, ClusterType> = {
    [TREZOA_CHAIN_IDS.mainnet]: 'mainnet',
    [TREZOA_CHAIN_IDS.devnet]: 'devnet',
    [TREZOA_CHAIN_IDS.testnet]: 'testnet',
};

const CLUSTER_ID_TO_CHAIN_ID: Partial<Record<TrezoaClusterId, string>> = {
    'trezoa:mainnet': TREZOA_CHAIN_IDS.mainnet,
    'trezoa:mainnet-beta': TREZOA_CHAIN_IDS.mainnet,
    'trezoa:devnet': TREZOA_CHAIN_IDS.devnet,
    'trezoa:testnet': TREZOA_CHAIN_IDS.testnet,
};

export function getChainIdFromCluster(cluster: TrezoaCluster): `trezoa:${string}` | null {
    const clusterType = getClusterType(cluster);

    if (clusterType === 'localnet' || clusterType === 'custom') {
        return null;
    }

    return getChainIdFromClusterType(clusterType);
}

export function getChainIdFromClusterId(clusterId: TrezoaClusterId): `trezoa:${string}` | null {
    return (CLUSTER_ID_TO_CHAIN_ID[clusterId] as `trezoa:${string}` | undefined) || null;
}

export function getChainIdFromClusterType(type: ClusterType): `trezoa:${string}` | null {
    switch (type) {
        case 'mainnet':
            return TREZOA_CHAIN_IDS.mainnet;
        case 'devnet':
            return TREZOA_CHAIN_IDS.devnet;
        case 'testnet':
            return TREZOA_CHAIN_IDS.testnet;
        case 'localnet':
        case 'custom':
            return null;
    }
}

export function getClusterTypeFromChainId(chainId: string): ClusterType | null {
    return CHAIN_ID_TO_CLUSTER_TYPE[chainId] || null;
}

export function getClusterIdFromChainId(chainId: string): TrezoaClusterId | null {
    const clusterType = getClusterTypeFromChainId(chainId);
    if (!clusterType) {
        return null;
    }

    switch (clusterType) {
        case 'mainnet':
            return 'trezoa:mainnet';
        case 'devnet':
            return 'trezoa:devnet';
        case 'testnet':
            return 'trezoa:testnet';
        default:
            return null;
    }
}

export function isTrezoaChain(chain: string): chain is `trezoa:${string}` {
    return chain.startsWith('trezoa:');
}

export function isKnownTrezoaChain(chain: string): boolean {
    return (
        chain === TREZOA_CHAIN_IDS.mainnet || chain === TREZOA_CHAIN_IDS.devnet || chain === TREZOA_CHAIN_IDS.testnet
    );
}

export function validateKnownTrezoaChain(chain: string): asserts chain is `trezoa:${string}` {
    if (!isTrezoaChain(chain)) {
        throw new Error(`Invalid chain format: expected 'trezoa:...', got '${chain}'`);
    }

    if (!isKnownTrezoaChain(chain)) {
        throw new Error(`Unknown Trezoa chain: ${chain}. Known chains: ${Object.values(TREZOA_CHAIN_IDS).join(', ')}`);
    }
}

export function getClusterTypeFromConnection(connection: Connection | null): ClusterType | null {
    if (!connection) {
        return null;
    }

    const rpcUrl = connection.rpcEndpoint || '';

    if (rpcUrl.includes('mainnet') || rpcUrl.includes('api.mainnet-beta')) {
        return 'mainnet';
    }

    if (rpcUrl.includes('testnet')) {
        return 'testnet';
    }

    if (rpcUrl.includes('devnet')) {
        return 'devnet';
    }

    if (rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1')) {
        return 'localnet';
    }

    return 'custom';
}

export function getChainIdFromConnection(
    connection: Connection | null,
    network?: 'mainnet' | 'devnet' | 'testnet',
): `trezoa:${string}` | null {
    if (network) {
        return getChainIdFromClusterType(network);
    }

    const clusterType = getClusterTypeFromConnection(connection);
    if (!clusterType) {
        return null;
    }

    return getChainIdFromClusterType(clusterType);
}

export function clusterToChainId(cluster: TrezoaCluster): `trezoa:${string}` | null {
    return getChainIdFromCluster(cluster);
}

export function chainIdToClusterType(chainId: string): ClusterType | null {
    return getClusterTypeFromChainId(chainId);
}

export function chainIdToClusterId(chainId: string): TrezoaClusterId | null {
    return getClusterIdFromChainId(chainId);
}
