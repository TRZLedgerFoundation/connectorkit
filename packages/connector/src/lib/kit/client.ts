/**
 * @trezoa/connector - Kit Client Factory
 *
 * Creates a Trezoa RPC and WebSocket subscriptions client.
 * Replaces gill's createTrezoaClient with a kit-based implementation.
 */

import type {
    DevnetUrl,
    MainnetUrl,
    TestnetUrl,
    Rpc,
    RpcSubscriptions,
    TrezoaRpcApi,
    TrezoaRpcSubscriptionsApi,
} from '@trezoa/kit';
import { createTrezoaRpc, createTrezoaRpcSubscriptions } from '@trezoa/kit';

import type { LocalnetUrl, ModifiedClusterUrl, TrezoaClientUrlOrMoniker } from './rpc';
import { getPublicTrezoaRpcUrl } from './rpc';

/**
 * Configuration for creating a Trezoa RPC client
 */
export interface CreateTrezoaClientRpcConfig {
    /** Custom port for the RPC endpoint */
    port?: number;
}

/**
 * Configuration for creating a Trezoa RPC subscriptions client
 */
export interface CreateTrezoaClientRpcSubscriptionsConfig {
    /** Custom port for the WebSocket endpoint */
    port?: number;
}

/**
 * Arguments for creating a Trezoa client
 */
export interface CreateTrezoaClientArgs<TClusterUrl extends TrezoaClientUrlOrMoniker = string> {
    /** Full RPC URL (for a private RPC endpoint) or the Trezoa moniker (for a public RPC endpoint) */
    urlOrMoniker: TrezoaClientUrlOrMoniker | TClusterUrl;
    /** Configuration used to create the `rpc` client */
    rpcConfig?: CreateTrezoaClientRpcConfig;
    /** Configuration used to create the `rpcSubscriptions` client */
    rpcSubscriptionsConfig?: CreateTrezoaClientRpcSubscriptionsConfig;
}

/**
 * A Trezoa client with RPC and WebSocket subscription capabilities
 */
export interface TrezoaClient<TClusterUrl extends ModifiedClusterUrl | string = string> {
    /** Used to make RPC calls to your RPC provider */
    rpc: Rpc<TrezoaRpcApi>;
    /** Used to make RPC websocket calls to your RPC provider */
    rpcSubscriptions: RpcSubscriptions<TrezoaRpcSubscriptionsApi>;
    /** Full RPC URL that was used to create this client */
    urlOrMoniker: TrezoaClientUrlOrMoniker | TClusterUrl;
}

/**
 * Create a Trezoa `rpc` and `rpcSubscriptions` client
 *
 * @param props - Configuration for the client
 * @returns Trezoa client with RPC and WebSocket subscription capabilities
 *
 * @example
 * ```ts
 * // Using a cluster moniker
 * const client = createTrezoaClient({ urlOrMoniker: 'devnet' });
 *
 * // Using a custom RPC URL
 * const client = createTrezoaClient({ urlOrMoniker: 'https://my-rpc.example.com' });
 *
 * // Making RPC calls
 * const balance = await client.rpc.getBalance(address).send();
 * ```
 */
export function createTrezoaClient(
    props: Omit<CreateTrezoaClientArgs<MainnetUrl | 'mainnet'>, 'urlOrMoniker'> & {
        urlOrMoniker: 'mainnet';
    },
): TrezoaClient<MainnetUrl>;
export function createTrezoaClient(
    props: Omit<CreateTrezoaClientArgs<DevnetUrl | 'devnet'>, 'urlOrMoniker'> & {
        urlOrMoniker: 'devnet';
    },
): TrezoaClient<DevnetUrl>;
export function createTrezoaClient(
    props: Omit<CreateTrezoaClientArgs<TestnetUrl | 'testnet'>, 'urlOrMoniker'> & {
        urlOrMoniker: 'testnet';
    },
): TrezoaClient<TestnetUrl>;
export function createTrezoaClient(
    props: Omit<CreateTrezoaClientArgs<LocalnetUrl | 'localnet'>, 'urlOrMoniker'> & {
        urlOrMoniker: 'localnet';
    },
): TrezoaClient<LocalnetUrl>;
export function createTrezoaClient<TClusterUrl extends ModifiedClusterUrl>(
    props: CreateTrezoaClientArgs<TClusterUrl>,
): TrezoaClient<TClusterUrl>;
export function createTrezoaClient<TCluster extends ModifiedClusterUrl>({
    urlOrMoniker,
    rpcConfig,
    rpcSubscriptionsConfig,
}: CreateTrezoaClientArgs<TCluster>): TrezoaClient<TCluster> {
    if (!urlOrMoniker) throw new Error('Cluster url or moniker is required');

    let parsedUrl: URL;

    // Try to parse as URL first
    if (urlOrMoniker instanceof URL) {
        parsedUrl = urlOrMoniker;
    } else {
        try {
            parsedUrl = new URL(urlOrMoniker.toString());
        } catch {
            // Not a valid URL, try as moniker
            try {
                parsedUrl = new URL(
                    getPublicTrezoaRpcUrl(urlOrMoniker.toString() as 'mainnet' | 'devnet' | 'testnet' | 'localnet'),
                );
            } catch {
                throw new Error('Invalid URL or cluster moniker');
            }
        }
    }

    if (!parsedUrl.protocol.match(/^https?:/i)) {
        throw new Error('Unsupported protocol. Only HTTP and HTTPS are supported');
    }

    // Apply custom port if specified
    if (rpcConfig?.port) {
        parsedUrl.port = rpcConfig.port.toString();
    }

    const rpcUrl = parsedUrl.toString();
    const rpc = createTrezoaRpc(rpcUrl) as Rpc<TrezoaRpcApi>;

    // Convert HTTP to WS for subscriptions
    parsedUrl.protocol = parsedUrl.protocol.replace('http', 'ws');

    // Apply WebSocket port if specified, or use default 8900 for localhost
    if (rpcSubscriptionsConfig?.port) {
        parsedUrl.port = rpcSubscriptionsConfig.port.toString();
    } else if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname.startsWith('127')) {
        parsedUrl.port = '8900';
    }

    const rpcSubscriptions = createTrezoaRpcSubscriptions(
        parsedUrl.toString(),
    ) as RpcSubscriptions<TrezoaRpcSubscriptionsApi>;

    return {
        rpc,
        rpcSubscriptions,
        urlOrMoniker: rpcUrl as TCluster,
    };
}
