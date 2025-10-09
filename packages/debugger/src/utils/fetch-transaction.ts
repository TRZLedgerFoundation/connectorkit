/**
 * Fetch transaction details from RPC
 */

import { Connection, ParsedTransactionWithMeta, VersionedTransactionResponse } from '@solana/web3.js';

export interface FetchTransactionResult {
    transaction: ParsedTransactionWithMeta | null;
    error?: string;
}

/**
 * Fetch full transaction details from RPC
 * Returns parsed transaction with metadata including logs
 */
export async function fetchTransactionDetails(
    signature: string,
    rpcUrl: string
): Promise<FetchTransactionResult> {
    try {
        const connection = new Connection(rpcUrl, 'confirmed');
        
        const transaction = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed',
        });

        if (!transaction) {
            return {
                transaction: null,
                error: 'Transaction not found',
            };
        }

        return { transaction };
    } catch (error) {
        console.error('Error fetching transaction:', error);
        return {
            transaction: null,
            error: error instanceof Error ? error.message : 'Failed to fetch transaction',
        };
    }
}

/**
 * Extract basic instruction information from a transaction
 */
export function getInstructionSummaries(transaction: ParsedTransactionWithMeta): Array<{
    index: number;
    programId: string;
    programName?: string;
}> {
    const instructions = transaction.transaction.message.instructions;
    
    return instructions.map((ix, index) => {
        const programId = 'programId' in ix ? ix.programId.toBase58() : 'unknown';
        return {
            index: index + 1,
            programId,
        };
    });
}

