/**
 * WalletConnect configuration types
 *
 * Types for configuring WalletConnect integration with the connector.
 * WalletConnect uses Trezoa JSON-RPC methods as documented at:
 * https://docs.walletconnect.network/wallet-sdk/chain-support/trezoa
 */

/**
 * WalletConnect app metadata
 * Required for session establishment with mobile/desktop wallets
 */
export interface WalletConnectMetadata {
    /** Application name displayed to the user in the wallet */
    name: string;
    /** Brief description of the application */
    description: string;
    /** Application URL (used for verification) */
    url: string;
    /** Array of icon URLs for the application */
    icons: string[];
}

/**
 * Configuration for WalletConnect integration
 *
 * When enabled, ConnectorKit registers a virtual "WalletConnect" wallet
 * into the Wallet Standard registry. This wallet proxies all signing
 * operations through WalletConnect's Trezoa JSON-RPC methods.
 *
 * @example
 * ```typescript
 * const config = getDefaultConfig({
 *   appName: 'My App',
 *   walletConnect: {
 *     enabled: true,
 *     projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
 *     metadata: {
 *       name: 'My App',
 *       description: 'My Trezoa Application',
 *       url: 'https://myapp.com',
 *       icons: ['https://myapp.com/icon.png'],
 *     },
 *     onDitplayUri: (uri) => {
 *       // Show QR code or deep link with this URI
 *       console.log('WalletConnect URI:', uri);
 *     },
 *   },
 * });
 * ```
 */
export interface WalletConnectConfig {
    /**
     * Enable WalletConnect integration.
     * When true, a "WalletConnect" wallet is registered in the Wallet Standard registry.
     * @default false
     */
    enabled?: boolean;

    /**
     * WalletConnect Cloud trezoa ID.
     * Get one at https://cloud.walletconnect.com/
     */
    projectId: string;

    /**
     * Application metadata shown to users during connection.
     */
    metadata: WalletConnectMetadata;

    /**
     * Default Trezoa chain/cluster for WalletConnect sessions.
     * Used as fallback if getCurrentChain is not provided.
     * Uses ConnectorKit's cluster ID format.
     * @default 'trezoa:mainnet'
     */
    defaultChain?: 'trezoa:mainnet' | 'trezoa:devnet' | 'trezoa:testnet';

    /**
     * Callback to get the current chain/cluster dynamically.
     * When provided, this is called before each request to determine the chain.
     * This allows WalletConnect to follow the app's cluster selection.
     * 
     * @returns The current chain ID (e.g., 'trezoa:mainnet', 'trezoa:devnet')
     */
    getCurrentChain?: () => 'trezoa:mainnet' | 'trezoa:devnet' | 'trezoa:testnet';

    /**
     * Callback invoked when WalletConnect needs to display a connection URI.
     * The app should render this as a QR code or use it for deep linking.
     *
     * If not provided, the URI will be logged to console in development.
     *
     * @param uri - The WalletConnect pairing URI (starts with "wc:")
     */
    onDitplayUri?: (uri: string) => void;

    /**
     * Callback invoked when a WalletConnect session is established.
     */
    onSessionEstablished?: () => void;

    /**
     * Callback invoked when a WalletConnect session is disconnected.
     */
    onSessionDisconnected?: () => void;

    /**
     * Optional relay URL override.
     * @default 'wss://relay.walletconnect.org'
     */
    relayUrl?: string;
}

/**
 * Internal transport interface for WalletConnect provider
 * Used by the shim wallet to communicate with WalletConnect
 */
export interface WalletConnectTransport {
    /** Establish connection and create/restore session */
    connect(): Promise<void>;

    /** Disconnect the current session */
    disconnect(): Promise<void>;

    /** Send a JSON-RPC request to the connected wallet */
    request<T = unknown>(args: {
        method: string;
        params: unknown;
        chainId?: string;
    }): Promise<T>;

    /** Check if there's an active session */
    isConnected(): boolean;

    /** Get accounts from the current session namespaces (if available) */
    getSessionAccounts(): string[];
}

/**
 * WalletConnect Trezoa account response
 * Response format from trezoa_getAccounts and trezoa_requestAccounts
 */
export interface WalletConnectTrezoaAccount {
    /** Base58-encoded public key */
    pubkey: string;
}

/**
 * WalletConnect sign message params
 * Parameters for trezoa_signMessage
 */
export interface WalletConnectSignMessageParams {
    /** Base58-encoded message bytes */
    message: string;
    /** Base58-encoded public key of the signer */
    pubkey: string;
}

/**
 * WalletConnect sign message result
 * Response from trezoa_signMessage
 */
export interface WalletConnectSignMessageResult {
    /** Base58-encoded signature */
    signature: string;
}

/**
 * WalletConnect sign transaction params
 * Parameters for trezoa_signTransaction
 */
export interface WalletConnectSignTransactionParams {
    /** Base64-encoded serialized transaction */
    transaction: string;
}

/**
 * WalletConnect sign transaction result
 * Response from trezoa_signTransaction
 */
export interface WalletConnectSignTransactionResult {
    /** Base58-encoded signature */
    signature: string;
    /** Optional: Base64-encoded signed transaction (if wallet returns full tx) */
    transaction?: string;
}

/**
 * WalletConnect sign all transactions params
 * Parameters for trezoa_signAllTransactions
 */
export interface WalletConnectSignAllTransactionsParams {
    /** Array of Base64-encoded serialized transactions */
    transactions: string[];
}

/**
 * WalletConnect sign all transactions result
 * Response from trezoa_signAllTransactions
 */
export interface WalletConnectSignAllTransactionsResult {
    /** Array of Base64-encoded signed transactions */
    transactions: string[];
}

/**
 * WalletConnect sign and send transaction params
 * Parameters for trezoa_signAndSendTransaction
 */
export interface WalletConnectSignAndSendTransactionParams {
    /** Base64-encoded serialized transaction */
    transaction: string;
    /** Optional send options */
    sendOptions?: {
        skipPreflight?: boolean;
        preflightCommitment?:
            | 'processed'
            | 'confirmed'
            | 'finalized'
            | 'recent'
            | 'single'
            | 'singleGossip'
            | 'root'
            | 'max';
        maxRetries?: number;
        minContextSlot?: number;
    };
}

/**
 * WalletConnect sign and send transaction result
 * Response from trezoa_signAndSendTransaction
 */
export interface WalletConnectSignAndSendTransactionResult {
    /** Base58-encoded transaction signature (transaction ID) */
    signature: string;
}
