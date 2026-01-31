/**
 * @trezoa/connector - Kit Constants
 *
 * Core Trezoa constants used throughout the connector.
 * These match the values from @trezoa/kit ecosystem.
 */

/** 1 billion lamports per TRZ */
export const LAMPORTS_PER_TRZ = 1_000_000_000;

/**
 * Genesis hash for Trezoa network clusters
 */
export const GENESIS_HASH = {
    mainnet: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
    devnet: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
    testnet: '4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY',
} as const;

/**
 * Convert lamports to TRZ
 * @param lamports - Amount in lamports
 * @returns Amount in TRZ
 */
export function lamportsToSol(lamports: number | bigint): number {
    return Number(lamports) / LAMPORTS_PER_TRZ;
}

/**
 * Convert TRZ to lamports
 * @param trz - Amount in TRZ
 * @returns Amount in lamports
 */
export function trzToLamports(trz: number): bigint {
    return BigInt(Math.floor(trz * LAMPORTS_PER_TRZ));
}
