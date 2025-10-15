/**
 * ConnectionManager unit tests
 * 
 * Tests wallet connection lifecycle, account management, and storage
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionManager } from './connection-manager';
import { StateManager } from '../core/state-manager';
import { EventEmitter } from '../core/event-emitter';
import type { ConnectorState } from '../../types/connector';
import { createMockPhantomWallet, createMockWallet } from '../../__tests__/mocks/wallet-standard-mock';
import { MockStorageAdapter } from '../../__tests__/mocks/storage-mock';
import { createEventCollector } from '../../__tests__/utils/test-helpers';
import { createMockWalletAccount } from '../../__tests__/fixtures/accounts';

describe('ConnectionManager', () => {
    let stateManager: StateManager;
    let eventEmitter: EventEmitter;
    let connectionManager: ConnectionManager;
    let storage: MockStorageAdapter<string | undefined>;
    let eventCollector: ReturnType<typeof createEventCollector>;

    beforeEach(() => {
        const initialState: ConnectorState = {
            wallets: [],
            selectedWallet: null,
            connected: false,
            connecting: false,
            accounts: [],
            selectedAccount: null,
            cluster: null,
            clusters: [],
        };

        stateManager = new StateManager(initialState);
        eventEmitter = new EventEmitter(false);
        storage = new MockStorageAdapter('test-wallet');
        eventCollector = createEventCollector();

        eventEmitter.on(eventCollector.collect);

        connectionManager = new ConnectionManager(stateManager, eventEmitter, storage, false);

        // Mock window
        global.window = {} as Window & typeof globalThis;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
        // @ts-expect-error - Clean up mock
        delete global.window;
    });

    describe('connect', () => {
        it('should connect to a wallet successfully', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            // Setup wallet with accounts
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(true);
            expect(state.connecting).toBe(false);
            expect(state.selectedWallet).toBe(wallet);
            expect(state.accounts).toHaveLength(1);
            expect(state.selectedAccount).toBe(account.address);
        });

        it('should emit connecting event', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            eventCollector.assertEventEmitted('connecting');
        });

        it('should emit wallet:connected event on success', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            eventCollector.assertEventEmitted('wallet:connected');
        });

        it('should handle connection errors', async () => {
            const wallet = createMockWallet({
                name: 'Test Wallet',
                connectBehavior: 'error',
            });

            await expect(connectionManager.connect(wallet)).rejects.toThrow();

            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(false);
            expect(state.connecting).toBe(false);
            expect(state.selectedWallet).toBe(null);
        });

        it('should emit error events on connection failure', async () => {
            const wallet = createMockWallet({
                name: 'Test Wallet',
                connectBehavior: 'error',
            });

            await expect(connectionManager.connect(wallet)).rejects.toThrow();

            eventCollector.assertEventEmitted('connection:failed');
            eventCollector.assertEventEmitted('error');
        });

        it('should save wallet name to storage', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            const savedWallet = await storage.get();
            expect(savedWallet).toBe('Phantom');
        });

        it('should throw error if wallet does not support standard connect', async () => {
            const wallet = createMockPhantomWallet();
            // Remove connect feature
            delete wallet.features['standard:connect'];

            await expect(connectionManager.connect(wallet)).rejects.toThrow('does not support standard connect');
        });

        it('should handle multiple accounts', async () => {
            const wallet = createMockPhantomWallet();
            const account1 = createMockWalletAccount('address1');
            const account2 = createMockWalletAccount('address2');
            const account3 = createMockWalletAccount('address3');
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account1, account2, account3],
            });

            await connectionManager.connect(wallet);

            const state = stateManager.getSnapshot();
            expect(state.accounts).toHaveLength(3);
            expect(state.selectedAccount).toBe('address1'); // First account selected
        });

        it('should not connect if window is undefined', async () => {
            // @ts-expect-error - Testing server-side
            delete global.window;
            
            const wallet = createMockPhantomWallet();
            
            await connectionManager.connect(wallet);
            
            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(false);
        });
    });

    describe('disconnect', () => {
        it('should disconnect from wallet', async () => {
            // First connect
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);
            expect(stateManager.getSnapshot().connected).toBe(true);

            // Then disconnect
            await connectionManager.disconnect();

            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(false);
            expect(state.selectedWallet).toBe(null);
            expect(state.accounts).toEqual([]);
            expect(state.selectedAccount).toBe(null);
        });

        it('should emit disconnected event', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);
            eventCollector.clear();

            await connectionManager.disconnect();

            eventCollector.assertEventEmitted('wallet:disconnected');
        });

        it('should call wallet disconnect if available', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            const disconnectFeature = wallet.features['standard:disconnect'];
            const disconnectSpy = vi.mocked(disconnectFeature.disconnect);

            await connectionManager.connect(wallet);
            await connectionManager.disconnect();

            expect(disconnectSpy).toHaveBeenCalled();
        });

        it('should handle disconnect errors gracefully', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            const disconnectFeature = wallet.features['standard:disconnect'];
            vi.mocked(disconnectFeature.disconnect).mockRejectedValue(new Error('Disconnect failed'));

            await connectionManager.connect(wallet);
            
            // Should not throw
            await expect(connectionManager.disconnect()).resolves.not.toThrow();

            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(false);
        });
    });

    describe('selectAccount', () => {
        it('should select a different account', async () => {
            const wallet = createMockPhantomWallet();
            const account1 = createMockWalletAccount('address1');
            const account2 = createMockWalletAccount('address2');
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account1, account2],
            });

            await connectionManager.connect(wallet);
            expect(stateManager.getSnapshot().selectedAccount).toBe('address1');

            await connectionManager.selectAccount('address2');

            expect(stateManager.getSnapshot().selectedAccount).toBe('address2');
        });

        it('should emit account-changed event', async () => {
            const wallet = createMockPhantomWallet();
            const account1 = createMockWalletAccount('address1');
            const account2 = createMockWalletAccount('address2');
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account1, account2],
            });

            await connectionManager.connect(wallet);
            eventCollector.clear();

            await connectionManager.selectAccount('address2');

            eventCollector.assertEventEmitted('account-changed');
        });

        it('should throw if account is not found', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            await expect(connectionManager.selectAccount('non-existent')).rejects.toThrow();
        });

        it('should validate address format', async () => {
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await connectionManager.connect(wallet);

            await expect(connectionManager.selectAccount('invalid-address')).rejects.toThrow();
        });
    });

    describe('storage', () => {
        it('should work without storage', async () => {
            const managerWithoutStorage = new ConnectionManager(stateManager, eventEmitter, undefined, false);
            
            const wallet = createMockPhantomWallet();
            const account = createMockWalletAccount();
            
            const connectFeature = wallet.features['standard:connect'];
            vi.mocked(connectFeature.connect).mockResolvedValue({
                accounts: [account],
            });

            await expect(managerWithoutStorage.connect(wallet)).resolves.not.toThrow();

            const state = stateManager.getSnapshot();
            expect(state.connected).toBe(true);
        });
    });
});

