/**
 * @trezoa/connector - Kit Utilities
 *
 * Local implementations of utilities that were previously imported from gill.
 * These are now built directly on top of @trezoa/kit packages.
 */

// Constants
export { LAMPORTS_PER_TRZ, GENESIS_HASH, lamportsToSol, trzToLamports } from './constants';

// RPC utilities
export {
    getPublicTrezoaRpcUrl,
    getWebSocketUrl,
    localnet,
    type TrezoaClusterMoniker,
    type LocalnetUrl,
    type GenericUrl,
    type ModifiedClusterUrl,
    type TrezoaClientUrlOrMoniker,
} from './rpc';

// Explorer utilities
export { getExplorerLink, type ExplorerCluster, type GetExplorerLinkArgs } from './explorer';

// Client factory
export {
    createTrezoaClient,
    type CreateTrezoaClientArgs,
    type CreateTrezoaClientRpcConfig,
    type CreateTrezoaClientRpcSubscriptionsConfig,
    type TrezoaClient,
} from './client';

// Debug utilities
export { debug, isDebugEnabled, type LogLevel } from './debug';

// Transaction preparation
export { prepareTransaction, type PrepareTransactionConfig } from './prepare-transaction';

// ============================================================================
// Signer Types (from kit-signers)
// ============================================================================
export {
    createSignableMessage,
    type MessageModifyingSigner,
    type TransactionSendingSigner,
    type SignableMessage,
    type MessageModifyingSignerConfig,
    type TransactionSendingSignerConfig,
    type Address,
    type SignatureBytes,
    type Transaction,
    type SignatureDictionary,
} from './signer-types';

// ============================================================================
// Signer Factories (from kit-signers)
// ============================================================================
export { createMessageSignerFromWallet, createTransactionSendingSignerFromWallet } from './signer-factories';

// ============================================================================
// Signer Integration (from kit-signers)
// ============================================================================
export { createKitSignersFromWallet, type KitSignersFromWallet } from './signer-integration';

// ============================================================================
// Signer Utilities (from kit-signers)
// ============================================================================
export {
    detectMessageModification,
    updateSignatureDictionary,
    freezeSigner,
    base58ToSignatureBytes,
    signatureBytesToBase58,
} from './signer-utils';
