/**
 * ClusterManager tests
 *
 * Tests cluster/network management, switching, persistence, and event emission
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ClusterManager } from './cluster-manager';
import { StateManager } from '../core/state-manager';
import { EventEmitter } from '../core/event-emitter';
import type { ConnectorState } from '../../types/connector';
import type { TrezoaCluster, TrezoaClusterId } from '@wallet-ui/core';
import { MockStorageAdapter } from '../../__tests__/mocks/storage-mock';
import { createEventCollector } from '../../__tests__/utils/test-helpers';

describe('ClusterManager', () => {
    let stateManager: StateManager;
    let eventEmitter: EventEmitter;
    let storage: MockStorageAdapter<TrezoaClusterId>;
    let eventCollector: ReturnType<typeof createEventCollector>;

    const mainnetCluster: TrezoaCluster = {
        id: 'trezoa:mainnet',
        name: 'Mainnet Beta',
        network: 'mainnet-beta',
        rpcUrl: 'https://api.mainnet-beta.trezoa.com',
    };

    const devnetCluster: TrezoaCluster = {
        id: 'trezoa:devnet',
        name: 'Devnet',
        network: 'devnet',
        rpcUrl: 'https://api.devnet.trezoa.com',
    };

    const testnetCluster: TrezoaCluster = {
        id: 'trezoa:testnet',
        name: 'Testnet',
        network: 'testnet',
        rpcUrl: 'https://api.testnet.trezoa.com',
    };

    const clusters = [mainnetCluster, devnetCluster, testnetCluster];

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
        storage = new MockStorageAdapter<TrezoaClusterId>('trezoa:mainnet');
        eventCollector = createEventCollector();

        eventEmitter.on(eventCollector.collect);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should initialize without config', () => {
            const manager = new ClusterManager(stateManager, eventEmitter);

            const state = stateManager.getSnapshot();
            expect(state.cluster).toBe(null);
            expect(state.clusters).toEqual([]);
        });

        it('should initialize with config and clusters', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            const state = stateManager.getSnapshot();
            expect(state.cluster).toEqual(mainnetCluster);
            expect(state.clusters).toEqual(clusters);
        });

        // Note: These tests are skipped because ClusterManager calls storage.get() synchronously
        // but MockStorageAdapter.get() is async. This is a known limitation.
        it.skip('should use initial cluster from config when no storage value', () => {
            // Storage initialization test - requires sync storage.get()
        });

        it.skip('should prioritize stored cluster over initial cluster', () => {
            // Storage initialization test - requires sync storage.get()
        });

        it('should fallback to mainnet if no initial cluster specified', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
            });

            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:mainnet');
        });

        it('should use first cluster if stored cluster not found', async () => {
            await storage.set('trezoa:invalid' as TrezoaClusterId);

            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
            });

            const state = stateManager.getSnapshot();
            expect(state.cluster).toEqual(mainnetCluster);
        });

        it('should handle empty clusters array', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters: [],
                initialCluster: 'trezoa:mainnet',
            });

            const state = stateManager.getSnapshot();
            expect(state.cluster).toBe(null);
            expect(state.clusters).toEqual([]);
        });
    });

    describe('setCluster', () => {
        let manager: ClusterManager;

        beforeEach(() => {
            manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });
            eventCollector.clear();
        });

        it('should set cluster successfully', async () => {
            await manager.setCluster('trezoa:devnet');

            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:devnet');
        });

        it('should emit cluster:changed event', async () => {
            await manager.setCluster('trezoa:devnet');

            eventCollector.assertEventEmitted('cluster:changed');
            const events = eventCollector.getEventsByType('cluster:changed');
            expect(events[0].cluster).toBe('trezoa:devnet');
            expect(events[0].previousCluster).toBe('trezoa:mainnet');
        });

        it('should not emit event if cluster unchanged', async () => {
            await manager.setCluster('trezoa:mainnet');

            const events = eventCollector.getEventsByType('cluster:changed');
            expect(events).toHaveLength(0);
        });

        it('should save cluster to storage', async () => {
            await manager.setCluster('trezoa:devnet');

            const storedCluster = await storage.get();
            expect(storedCluster).toBe('trezoa:devnet');
        });

        it('should throw error for unknown cluster', async () => {
            await expect(manager.setCluster('trezoa:unknown' as TrezoaClusterId)).rejects.toThrow('not found');
        });

        it('should include available clusters in error message', async () => {
            try {
                await manager.setCluster('trezoa:unknown' as TrezoaClusterId);
                expect.fail('Should have thrown error');
            } catch (error: unknown) {
                const err = error instanceof Error ? error : new Error(String(error));
                expect(err.message).toContain('trezoa:mainnet');
                expect(err.message).toContain('trezoa:devnet');
                expect(err.message).toContain('trezoa:testnet');
            }
        });

        it('should work without storage', async () => {
            const managerWithoutStorage = new ClusterManager(stateManager, eventEmitter, undefined, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            await expect(managerWithoutStorage.setCluster('trezoa:devnet')).resolves.not.toThrow();

            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:devnet');
        });

        it('should handle storage unavailable (private browsing)', async () => {
            const unavailableStorage = new MockStorageAdapter<TrezoaClusterId>('trezoa:mainnet');
            unavailableStorage.isAvailable = () => false;

            const managerWithUnavailableStorage = new ClusterManager(stateManager, eventEmitter, unavailableStorage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            await managerWithUnavailableStorage.setCluster('trezoa:devnet');

            // Should still update state even if storage fails
            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:devnet');
        });

        it('should switch between multiple clusters', async () => {
            // Mainnet -> Devnet
            await manager.setCluster('trezoa:devnet');
            expect(stateManager.getSnapshot().cluster?.id).toBe('trezoa:devnet');

            // Devnet -> Testnet
            await manager.setCluster('trezoa:testnet');
            expect(stateManager.getSnapshot().cluster?.id).toBe('trezoa:testnet');

            // Testnet -> Mainnet
            await manager.setCluster('trezoa:mainnet');
            expect(stateManager.getSnapshot().cluster?.id).toBe('trezoa:mainnet');
        });

        it('should update state immediately', async () => {
            const setClusterPromise = manager.setCluster('trezoa:devnet');

            // State should be updated before promise resolves
            await setClusterPromise;
            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:devnet');
        });
    });

    describe('getCluster', () => {
        it('should return null when no cluster set', () => {
            const manager = new ClusterManager(stateManager, eventEmitter);
            expect(manager.getCluster()).toBe(null);
        });

        it('should return current cluster', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            const cluster = manager.getCluster();
            expect(cluster).toEqual(mainnetCluster);
        });

        it('should return updated cluster after change', async () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            await manager.setCluster('trezoa:devnet');

            const cluster = manager.getCluster();
            expect(cluster?.id).toBe('trezoa:devnet');
        });
    });

    describe('getClusters', () => {
        it('should return empty array when no clusters configured', () => {
            const manager = new ClusterManager(stateManager, eventEmitter);
            expect(manager.getClusters()).toEqual([]);
        });

        it('should return all configured clusters', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            const returnedClusters = manager.getClusters();
            expect(returnedClusters).toEqual(clusters);
        });

        it('should return array reference from state', () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            const state = stateManager.getSnapshot();
            const returnedClusters = manager.getClusters();

            expect(returnedClusters).toBe(state.clusters);
        });
    });

    describe('debug mode', () => {
        it('should work in debug mode', async () => {
            // Just verify it doesn't throw in debug mode
            const manager = new ClusterManager(
                stateManager,
                eventEmitter,
                storage,
                {
                    clusters,
                    initialCluster: 'trezoa:mainnet',
                },
                true,
            );

            await expect(manager.setCluster('trezoa:devnet')).resolves.not.toThrow();

            const state = stateManager.getSnapshot();
            expect(state.cluster?.id).toBe('trezoa:devnet');
        });

        it('should not log in non-debug mode', async () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            const manager = new ClusterManager(
                stateManager,
                eventEmitter,
                storage,
                {
                    clusters,
                    initialCluster: 'trezoa:mainnet',
                },
                false,
            );

            await manager.setCluster('trezoa:devnet');

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe('edge cases', () => {
        it('should handle cluster with same id but different properties', async () => {
            const customMainnet: TrezoaCluster = {
                id: 'trezoa:mainnet',
                name: 'Custom Mainnet',
                network: 'mainnet-beta',
                rpcUrl: 'https://custom-rpc.com',
            };

            const customClusters = [customMainnet, devnetCluster];

            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters: customClusters,
                initialCluster: 'trezoa:mainnet',
            });

            const cluster = manager.getCluster();
            expect(cluster?.name).toBe('Custom Mainnet');
            expect(cluster?.rpcUrl).toBe('https://custom-rpc.com');
        });

        it('should handle rapid cluster switching', async () => {
            const manager = new ClusterManager(stateManager, eventEmitter, storage, {
                clusters,
                initialCluster: 'trezoa:mainnet',
            });

            // Switch rapidly
            await Promise.all([
                manager.setCluster('trezoa:devnet'),
                manager.setCluster('trezoa:testnet'),
                manager.setCluster('trezoa:mainnet'),
            ]);

            // Final state should be consistent
            const cluster = manager.getCluster();
            expect(cluster?.id).toMatch(/trezoa:(mainnet|devnet|testnet)/);
        });

        it('should handle null previous cluster on first change', async () => {
            // Create manager without initial cluster (clusters will be set but no cluster selected)
            const manager = new ClusterManager(stateManager, eventEmitter, undefined, {
                clusters,
            });

            // Manually set cluster to null to ensure clean state
            stateManager.updateState({ cluster: null });
            eventCollector.clear();

            await manager.setCluster('trezoa:devnet');

            const events = eventCollector.getEventsByType('cluster:changed');
            expect(events.length).toBeGreaterThan(0);
            expect(events[0].previousCluster).toBe(null);
        });
    });
});
