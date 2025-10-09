'use client';

import { useState } from 'react';
import { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useTransactionSigner, useCluster, useConnectorClient } from '@connector-kit/connector';
import { TransactionForm } from './transaction-form';
import { TransactionResult } from './transaction-result';

/**
 * Modern SOL Transfer Component
 * 
 * Demonstrates using connector-kit's transaction signer directly (without compat layer).
 * This shows how to use the TransactionSigner interface for modern Solana development.
 */
export function ModernSolTransfer() {
    const { signer } = useTransactionSigner();
    const { cluster, rpcUrl } = useCluster();
    const client = useConnectorClient();
    const [signature, setSignature] = useState<string | null>(null);

    async function handleTransfer(recipientAddress: string, amount: number) {
        if (!signer || !rpcUrl) {
            throw new Error('Wallet not connected or cluster not selected');
        }

        if (!signer.address) {
            throw new Error('Wallet address not available');
        }

        // Create connection to Solana network
        const connection = new Connection(rpcUrl, 'confirmed');

        // Create recipient public key
        const recipientPubkey = new PublicKey(recipientAddress);
        const senderPubkey = new PublicKey(signer.address);

        // Get recent blockhash
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

        // Create transfer instruction
        const transferInstruction = SystemProgram.transfer({
            fromPubkey: senderPubkey,
            toPubkey: recipientPubkey,
            lamports: amount * LAMPORTS_PER_SOL,
        });

        // Build transaction
        const transaction = new Transaction({
            feePayer: senderPubkey,
            blockhash,
            lastValidBlockHeight,
        }).add(transferInstruction);

        // Use transaction signer directly (modern approach - no compat layer)
        const capabilities = signer.getCapabilities();
        let sig: string;

        if (capabilities.canSign) {
            // Sign then send manually
            const signedTx = await signer.signTransaction(transaction);
            const rawTransaction = signedTx.serialize();
            sig = await connection.sendRawTransaction(rawTransaction);
        } else {
            throw new Error('Wallet does not support transaction signing');
        }
        
        setSignature(sig);
        
        // Track transaction in debugger
        if (client) {
            (client as any).trackTransaction({
                signature: sig,
                status: 'pending' as const,
                method: 'signer.signTransaction + sendRawTransaction',
                feePayer: signer.address,
            });
        }

        // Wait for confirmation
        try {
            await connection.confirmTransaction({
                signature: sig,
                blockhash,
                lastValidBlockHeight,
            });
            
            // Update status to confirmed
            if (client) {
                (client as any).updateTransactionStatus(sig, 'confirmed');
            }
        } catch (confirmError) {
            // Update status to failed if confirmation fails
            if (client) {
                (client as any).updateTransactionStatus(sig, 'failed',
                    confirmError instanceof Error ? confirmError.message : 'Confirmation failed'
                );
            }
            throw confirmError;
        }
    }

    return (
        <div className="space-y-4">
            <TransactionForm
                title="Modern SOL Transfer"
                description="Using TransactionSigner directly (no compat layer)"
                onSubmit={handleTransfer}
                disabled={!signer}
                defaultRecipient="DemoWa11et1111111111111111111111111111111111"
            />
            {signature && <TransactionResult signature={signature} cluster={cluster?.id || 'devnet'} />}
        </div>
    );
}

