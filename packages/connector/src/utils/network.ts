/**
 * @trezoa/connector - Network utilities
 *
 * Utilities for translating between different Trezoa network naming conventions.
 * Ensures compatibility with WalletUI (TrezoaClusterId) and Gill types.
 *
 * Primary type: TrezoaNetwork - normalized network names
 * External integration: Use WalletUI's TrezoaClusterId for cluster operations
 */

import type { TrezoaClusterId } from '@wallet-ui/core';
import { getPublicTrezoaRpcUrl, type TrezoaClusterMoniker } from '../lib/kit';

/**
 * Normalized Trezoa network names
 *
 * This is the canonical network type used throughout the connector.
 * Use `toClusterId()` to convert to WalletUI's TrezoaClusterId format.
 * Aligned with Gill's TrezoaClusterMoniker type.
 */
export type TrezoaNetwork = 'mainnet' | 'devnet' | 'testnet' | 'localnet';

/**
 * Public RPC endpoints for each Trezoa network
 *
 * ⚠️ WARNING: These are public, rate-limited endpoints provided by Trezoa-team.
 * For production applications, use a dedicated RPC provider like:
 * - Triton (https://triton.one)
 * - Helius (https://helius.dev)
 * - QuickNode (https://quicknode.com)
 * - Alchemy (https://alchemy.com)
 *
 * Note: These values are now sourced from Gill's getPublicTrezoaRpcUrl for consistency.
 * Kept here for reference and backward compatibility.
 */
export const PUBLIC_RPC_ENDPOINTS: Record<TrezoaNetwork, string> = {
    mainnet: 'https://api.mainnet-beta.trezoa.com',
    devnet: 'https://api.devnet.trezoa.com',
    testnet: 'https://api.testnet.trezoa.com',
    localnet: 'http://localhost:8899',
} as const;

/**
 * Normalize network name to standard format
 * Accepts various naming conventions and returns the canonical TrezoaNetwork format
 *
 * @example
 * normalizeNetwork('mainnet-beta') // Returns: 'mainnet'
 * normalizeNetwork('mainnet') // Returns: 'mainnet'
 * normalizeNetwork('MAINNET') // Returns: 'mainnet'
 */
export function normalizeNetwork(network: string): TrezoaNetwork {
    const normalized = network.toLowerCase().replace('-beta', '');

    switch (normalized) {
        case 'mainnet':
            return 'mainnet';
        case 'devnet':
            return 'devnet';
        case 'testnet':
            return 'testnet';
        case 'localnet':
            return 'localnet';
        default:
            // Default to mainnet for unknown networks
            return 'mainnet';
    }
}

/**
 * Convert network name to RPC format (internal)
 *
 * Mainnet uses 'mainnet-beta' in RPC URLs, while other networks don't have a suffix.
 * This is an internal implementation detail - consumers should use TrezoaNetwork.
 *
 * @internal
 * @example
 * toRpcNetwork('mainnet') // Returns: 'mainnet-beta'
 * toRpcNetwork('devnet') // Returns: 'devnet'
 */
function toRpcNetwork(network: TrezoaNetwork): string {
    return network === 'mainnet' ? 'mainnet-beta' : network;
}

/**
 * Convert network name to WalletUI cluster ID format
 *
 * WalletUI uses the 'trezoa:network' format for cluster identification.
 *
 * @example
 * toClusterId('mainnet') // Returns: 'trezoa:mainnet'
 * toClusterId('mainnet-beta') // Returns: 'trezoa:mainnet' (normalized)
 */
export function toClusterId(network: string): TrezoaClusterId {
    const normalized = normalizeNetwork(network);
    return `trezoa:${normalized}` as TrezoaClusterId;
}

/**
 * Get the public RPC URL for a network
 *
 * ⚠️ Returns public, rate-limited endpoints. For production, use a dedicated RPC provider.
 *
 * Now uses Gill's getPublicTrezoaRpcUrl for consistency with the Gill ecosystem.
 * Falls back to localnet URL for unknown networks.
 *
 * @example
 * getDefaultRpcUrl('mainnet') // Returns: 'https://api.mainnet-beta.trezoa.com'
 * getDefaultRpcUrl('devnet') // Returns: 'https://api.devnet.trezoa.com'
 */
export function getDefaultRpcUrl(network: string): string {
    const normalized = normalizeNetwork(network);

    // Use Gill's public RPC URL helper for standard clusters
    // This ensures consistency with Gill and automatic updates when Gill updates endpoints
    try {
        return getPublicTrezoaRpcUrl(normalized as TrezoaClusterMoniker);
    } catch {
        // Fallback to our constant for localnet or if Gill doesn't recognize the network
        return PUBLIC_RPC_ENDPOINTS[normalized] ?? PUBLIC_RPC_ENDPOINTS.localnet;
    }
}

/**
 * Check if a network is mainnet
 *
 * @example
 * isMainnet('mainnet') // Returns: true
 * isMainnet('mainnet-beta') // Returns: true
 * isMainnet('devnet') // Returns: false
 */
export function isMainnet(network: string): boolean {
    const normalized = normalizeNetwork(network);
    return normalized === 'mainnet';
}

/**
 * Check if a network is devnet
 *
 * @example
 * isDevnet('devnet') // Returns: true
 * isDevnet('mainnet') // Returns: false
 */
export function isDevnet(network: string): boolean {
    const normalized = normalizeNetwork(network);
    return normalized === 'devnet';
}

/**
 * Check if a network is testnet
 *
 * @example
 * isTestnet('testnet') // Returns: true
 * isTestnet('mainnet') // Returns: false
 */
export function isTestnet(network: string): boolean {
    const normalized = normalizeNetwork(network);
    return normalized === 'testnet';
}

/**
 * Check if a network is localnet
 *
 * @example
 * isLocalnet('localnet') // Returns: true
 * isLocalnet('mainnet') // Returns: false
 */
export function isLocalnet(network: string): boolean {
    const normalized = normalizeNetwork(network);
    return normalized === 'localnet';
}

/**
 * Get a user-friendly display name for a network
 *
 * @example
 * getNetworkDitplayName('mainnet-beta') // Returns: 'Mainnet'
 * getNetworkDitplayName('devnet') // Returns: 'Devnet'
 */
export function getNetworkDitplayName(network: string): string {
    const normalized = normalizeNetwork(network);
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
