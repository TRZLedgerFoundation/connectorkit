/**
 * @trezoa/connector - useCluster hook
 *
 * React hook for managing Trezoa cluster (network) state
 */

'use client';

import { useMemo } from 'react';
import type { TrezoaCluster, TrezoaClusterId } from '@wallet-ui/core';
import { useConnector, useConnectorClient } from '../ui/connector-provider';
import {
    getClusterExplorerUrl,
    isMainnetCluster,
    isDevnetCluster,
    isTestnetCluster,
    isLocalCluster,
    getClusterType,
    type ClusterType,
} from '../utils/cluster';

export interface UseClusterReturn {
    /** Currently active cluster */
    cluster: TrezoaCluster | null;
    /** All available clusters */
    clusters: TrezoaCluster[];
    /** Set the active cluster */
    setCluster: (id: TrezoaClusterId) => Promise<void>;
    /** Whether the current cluster is mainnet */
    isMainnet: boolean;
    /** Whether the current cluster is devnet */
    isDevnet: boolean;
    /** Whether the current cluster is testnet */
    isTestnet: boolean;
    /** Whether the current cluster is running locally */
    isLocal: boolean;
    /** Trezoa Explorer base URL for the current cluster */
    explorerUrl: string;
    /** Cluster type (mainnet, devnet, testnet, localnet, custom) */
    type: ClusterType | null;
}

/**
 * Hook for managing Trezoa cluster (network) selection
 *
 * @example
 * ```tsx
 * function ClusterSwitcher() {
 *   const { cluster, clusters, setCluster, isMainnet } = useCluster()
 *
 *   return (
 *     <select
 *       value={cluster?.id}
 *       onChange={(e) => setCluster(e.target.value as TrezoaClusterId)}
 *     >
 *       {clusters.map(c => (
 *         <option key={c.id} value={c.id}>{c.label}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 */
export function useCluster(): UseClusterReturn {
    const { cluster, clusters } = useConnector();
    const client = useConnectorClient();

    if (!client) {
        throw new Error('useCluster must be used within ConnectorProvider');
    }

    const setCluster = useMemo(
        () => async (id: TrezoaClusterId) => {
            await client.setCluster(id);
        },
        [client],
    );

    return useMemo(() => {
        const isMainnet = cluster ? isMainnetCluster(cluster) : false;
        const isDevnet = cluster ? isDevnetCluster(cluster) : false;
        const isTestnet = cluster ? isTestnetCluster(cluster) : false;
        const isLocal = cluster ? isLocalCluster(cluster) : false;
        const explorerUrl = cluster ? getClusterExplorerUrl(cluster) : '';
        const type = cluster ? getClusterType(cluster) : null;

        return {
            cluster,
            clusters,
            setCluster,
            isMainnet,
            isDevnet,
            isTestnet,
            isLocal,
            explorerUrl,
            type,
        };
    }, [cluster, clusters, setCluster]);
}
