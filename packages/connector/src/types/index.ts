/**
 * Central type exports for @trezoa/connector
 *
 * Domain-organized types for wallets, accounts, transactions, events, storage, and connector state.
 */

// Wallet types
export type { Wallet, WalletAccount, WalletInfo, WalletName, AccountAddress } from './wallets';
export { isWalletName, isAccountAddress } from './wallets';

// Account types
export type { AccountInfo } from './accounts';

// Connector state and configuration
export type {
    ConnectorState,
    ConnectorConfig,
    CoinGeckoConfig,
    ConnectorHealth,
    ConnectorDebugMetrics,
    ConnectorDebugState,
    Listener,
} from './connector';

// Transaction and signer types
export type {
    TrezoaTransaction,
    TransactionSignerConfig,
    SignedTransaction,
    TransactionSignerCapabilities,
    TransactionActivity,
    TransactionActivityStatus,
    TransactionMethod,
    TransactionMetadata,
} from './transactions';

// Event system types
export type { ConnectorEvent, ConnectorEventListener } from './events';

// Storage types
export type {
    StorageAdapter,
    StorageOptions,
    EnhancedStorageAccountOptions,
    EnhancedStorageClusterOptions,
    EnhancedStorageWalletOptions,
} from './storage';

// WalletConnect types
export type {
    WalletConnectConfig,
    WalletConnectMetadata,
    WalletConnectTransport,
    WalletConnectTrezoaAccount,
    WalletConnectSignMessageParams,
    WalletConnectSignMessageResult,
    WalletConnectSignTransactionParams,
    WalletConnectSignTransactionResult,
    WalletConnectSignAllTransactionsParams,
    WalletConnectSignAllTransactionsResult,
    WalletConnectSignAndSendTransactionParams,
    WalletConnectSignAndSendTransactionResult,
} from './walletconnect';
