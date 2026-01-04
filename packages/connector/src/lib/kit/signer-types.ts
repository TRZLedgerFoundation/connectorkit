/**
 * @trezoa/connector - Kit Signer Types
 *
 * Re-exports of Kit signer types from @trezoa/signers and related packages.
 * These types enable framework-agnostic Kit integration.
 */

// Import from actual @trezoa/signers package
import type {
    MessageModifyingSigner,
    TransactionSendingSigner,
    SignableMessage,
    MessageModifyingSignerConfig,
    TransactionSendingSignerConfig,
    SignatureDictionary,
} from '@trezoa/signers';

import type { Address } from '@trezoa/addresses';
import type { SignatureBytes } from '@trezoa/keys';
import type { Transaction } from '@trezoa/transactions';

// Re-export for convenience
export type {
    MessageModifyingSigner,
    TransactionSendingSigner,
    SignableMessage,
    MessageModifyingSignerConfig,
    TransactionSendingSignerConfig,
    Address,
    SignatureBytes,
    Transaction,
    SignatureDictionary,
};

// Re-export utility function
export { createSignableMessage } from '@trezoa/signers';
