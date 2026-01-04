/**
 * Mock implementation of @walletconnect/universal-provider for testing
 *
 * This mock is used by vitest to avoid requiring the real WalletConnect
 * dependency during testing. The real implementation uses dynamic imports
 * so this mock is only loaded during test runs.
 */

export interface UniversalProviderOpts {
    projectId: string;
    metadata?: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    relayUrl?: string;
}

export interface ConnectParams {
    namespaces?: {
        trezoa?: {
            chains: string[];
            methods: string[];
            events: string[];
        };
    };
    optionalNamespaces?: {
        trezoa?: {
            chains: string[];
            methods: string[];
            events: string[];
        };
    };
}

export interface SessionTypes {
    struct: {
        topic: string;
        namespaces: Record<string, unknown>;
    };
}

type EventListener = (...args: unknown[]) => void;

/**
 * Mock UniversalProvider class for testing
 */
class MockUniversalProvider {
    private listeners: Map<string, Set<EventListener>> = new Map();
    public session: SessionTypes['struct'] | undefined = undefined;

    static async init(_opts: UniversalProviderOpts): Promise<MockUniversalProvider> {
        return new MockUniversalProvider();
    }

    async connect(_params: ConnectParams): Promise<SessionTypes['struct'] | undefined> {
        this.session = {
            topic: 'mock-topic',
            namespaces: {},
        };
        return this.session;
    }

    async disconnect(): Promise<void> {
        this.session = undefined;
    }

    async request<T = unknown>(_args: { method: string; params?: unknown; chainId?: string }): Promise<T> {
        // Return mock responses based on method
        const method = _args.method;
        if (method === 'trezoa_getAccounts' || method === 'trezoa_requestAccounts') {
            return [{ pubkey: 'MockPublicKey111111111111111111111111111' }] as unknown as T;
        }
        if (method === 'trezoa_signMessage') {
            return { signature: 'MockSignature' } as unknown as T;
        }
        if (method === 'trezoa_signTransaction') {
            return { signature: 'MockSignature' } as unknown as T;
        }
        if (method === 'trezoa_signAllTransactions') {
            return { transactions: [] } as unknown as T;
        }
        if (method === 'trezoa_signAndSendTransaction') {
            return { signature: 'MockTxSignature' } as unknown as T;
        }
        throw new Error(`Mock: Unknown method ${method}`);
    }

    on(event: string, listener: EventListener): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }

    off(event: string, listener: EventListener): void {
        this.listeners.get(event)?.delete(listener);
    }

    emit(event: string, ...args: unknown[]): void {
        this.listeners.get(event)?.forEach(listener => listener(...args));
    }
}

export default MockUniversalProvider;
