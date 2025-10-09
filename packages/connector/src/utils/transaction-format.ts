/**
 * Transaction Format Utilities
 * 
 * Utilities for detecting and converting between different transaction formats:
 * - web3.js Transaction/VersionedTransaction objects
 * - Serialized Uint8Array (Wallet Standard format)
 * - Other TypedArray formats
 * 
 * Note: Uses dynamic imports for @solana/web3.js to avoid bundling it
 * since it's only needed for the compat layer.
 */

/**
 * Check if a value is a web3.js Transaction or VersionedTransaction object
 * 
 * @param tx - Value to check
 * @returns True if it's a web3.js transaction object
 */
export function isWeb3jsTransaction(tx: any): boolean {
    // Duck-typing: if it has a serialize method, it's likely a web3.js transaction
    return tx && typeof tx.serialize === 'function';
}

/**
 * Serialize a transaction to Uint8Array format (required for Wallet Standard)
 * 
 * @param tx - Transaction to serialize (web3.js object, Uint8Array, or TypedArray)
 * @returns Serialized transaction bytes
 * @throws Error if transaction format is unsupported
 */
export function serializeTransaction(tx: any): Uint8Array {
    // web3.js Transaction/VersionedTransaction object
    if (isWeb3jsTransaction(tx)) {
        return tx.serialize({
            requireAllSignatures: false,
            verifySignatures: false
        });
    }
    
    // Already serialized as Uint8Array
    if (tx instanceof Uint8Array) {
        return tx;
    }
    
    // Other TypedArray format
    if (ArrayBuffer.isView(tx)) {
        return new Uint8Array(tx.buffer, tx.byteOffset, tx.byteLength);
    }
    
    throw new Error('Unsupported transaction format - must be Transaction, VersionedTransaction, or Uint8Array');
}

/**
 * Deserialize bytes to a web3.js VersionedTransaction object
 * Uses dynamic import to avoid bundling @solana/web3.js
 * 
 * @param bytes - Serialized transaction bytes
 * @returns VersionedTransaction object
 */
export async function deserializeToWeb3jsTransaction(bytes: Uint8Array): Promise<any> {
    const { VersionedTransaction } = await import('@solana/web3.js');
    return VersionedTransaction.deserialize(bytes);
}

/**
 * Smart converter that preserves the original format
 * Converts to Wallet Standard format (Uint8Array) and tracks original type
 * 
 * @param tx - Transaction in any supported format
 * @returns Object with serialized bytes and format flag
 */
export function prepareTransactionForWallet(tx: any): { serialized: Uint8Array; wasWeb3js: boolean } {
    const wasWeb3js = isWeb3jsTransaction(tx);
    const serialized = serializeTransaction(tx);
    return { serialized, wasWeb3js };
}

/**
 * Convert signed transaction bytes back to original format if needed
 * 
 * @param signedBytes - Signed transaction as Uint8Array
 * @param wasWeb3js - Whether the original was a web3.js object
 * @returns Transaction in appropriate format (async if conversion needed)
 */
export async function convertSignedTransaction(signedBytes: Uint8Array, wasWeb3js: boolean): Promise<any> {
    if (wasWeb3js) {
        return await deserializeToWeb3jsTransaction(signedBytes);
    }
    return signedBytes;
}

