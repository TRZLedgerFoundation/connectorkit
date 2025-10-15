/**
 * Wallet test fixtures
 * 
 * Pre-configured wallet instances for testing
 */

import type { WalletInfo } from '../../types/wallets';
import { createMockPhantomWallet, createMockSolflareWallet, createMockBackpackWallet } from '../mocks/wallet-standard-mock';

export const PHANTOM_WALLET_INFO: WalletInfo = {
    name: 'Phantom',
    icon: 'data:image/svg+xml,<svg><text>P</text></svg>',
    chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet'],
    features: ['standard:connect', 'standard:disconnect', 'standard:events', 'solana:signTransaction', 'solana:signMessage'],
};

export const SOLFLARE_WALLET_INFO: WalletInfo = {
    name: 'Solflare',
    icon: 'data:image/svg+xml,<svg><text>S</text></svg>',
    chains: ['solana:mainnet', 'solana:devnet', 'solana:testnet'],
    features: ['standard:connect', 'standard:disconnect', 'standard:events', 'solana:signTransaction', 'solana:signMessage'],
};

export const BACKPACK_WALLET_INFO: WalletInfo = {
    name: 'Backpack',
    icon: 'data:image/svg+xml,<svg><text>B</text></svg>',
    chains: ['solana:mainnet', 'solana:devnet'],
    features: ['standard:connect', 'standard:disconnect', 'standard:events', 'solana:signTransaction'],
};

/**
 * Create a set of test wallets
 */
export function createTestWallets() {
    return {
        phantom: createMockPhantomWallet(),
        solflare: createMockSolflareWallet(),
        backpack: createMockBackpackWallet(),
    };
}

/**
 * Create a wallet that fails to connect
 */
export function createFailingWallet() {
    return createMockPhantomWallet({
        name: 'Failing Wallet',
        connectBehavior: 'error',
    });
}

/**
 * Create a wallet that times out on connect
 */
export function createTimeoutWallet() {
    return createMockPhantomWallet({
        name: 'Timeout Wallet',
        connectBehavior: 'timeout',
    });
}

