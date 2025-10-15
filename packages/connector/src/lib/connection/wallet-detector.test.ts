/**
 * WalletDetector tests
 *
 * Tests wallet discovery, direct wallet detection, authenticity verification, and registry management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Create hoisted mock wallet registry that will be exposed via window.navigator.wallets
const { mockWallets, mockListeners, mockWalletsRegistry } = vi.hoisted(() => {
    const wallets: any[] = [];
    const listeners = new Map<string, Set<() => void>>();
    const registry = {
        get: () => {
            console.log('[MOCK REGISTRY] get() called, returning', wallets.length, 'wallets');
            return wallets;
        },
        on: (event: string, listener: () => void) => {
            console.log('[MOCK REGISTRY] on() called, event:', event);
            const listenerSet = listeners.get(event) || new Set();
            listenerSet.add(listener);
            listeners.set(event, listenerSet);
            return () => listenerSet.delete(listener);
        },
        register: (wallet: any) => {
            console.log('[MOCK REGISTRY] register() called');
            wallets.push(wallet);
            listeners.get('register')?.forEach(l => l());
        },
        unregister: (wallet: any) => {
            console.log('[MOCK REGISTRY] unregister() called');
            const index = wallets.indexOf(wallet);
            if (index > -1) {
                wallets.splice(index, 1);
                listeners.get('unregister')?.forEach(l => l());
            }
        },
    };
    return { mockWallets: wallets, mockListeners: listeners, mockWalletsRegistry: registry };
});

vi.mock('./wallet-authenticity-verifier', () => ({
    WalletAuthenticityVerifier: {
        verify: () => ({
            authentic: true,
            confidence: 0.95,
            reason: 'Test wallet passed verification',
            warnings: [],
            securityScore: {
                walletStandardCompliance: 1.0,
                methodIntegrity: 1.0,
                chainSupport: 1.0,
                maliciousPatterns: 1.0,
                identityConsistency: 1.0,
            },
        }),
    },
}));

// Mock the wallet-standard-shim to use window.navigator.wallets when available
vi.mock('../adapters/wallet-standard-shim', () => ({
    getWalletsRegistry: () => {
        // Return registry that checks window.navigator.wallets at runtime
        return {
            get: () => {
                try {
                    const wallets = (global.window as any)?.navigator?.wallets?.get();
                    return Array.isArray(wallets) ? wallets : [];
                } catch {
                    return [];
                }
            },
            on: (event: string, callback: () => void) => {
                try {
                    return (global.window as any)?.navigator?.wallets?.on(event, callback) || (() => {});
                } catch {
                    return () => {};
                }
            },
        };
    },
}));

import { WalletDetector, type DirectWallet } from './wallet-detector';
import { StateManager } from '../core/state-manager';
import { EventEmitter } from '../core/event-emitter';
import type { ConnectorState } from '../../types/connector';
import { createMockPhantomWallet } from '../../__tests__/mocks/wallet-standard-mock';
import { createEventCollector } from '../../__tests__/utils/test-helpers';
import { getWalletsRegistry } from '../adapters/wallet-standard-shim';

// Test subclass with detailed logging
class LoggingWalletDetector extends WalletDetector {
    initialize(): void {
        console.log('[LOGGING DETECTOR] initialize() called');
        console.log('[LOGGING DETECTOR] window?', typeof window !== 'undefined');

        if (typeof window === 'undefined') {
            console.log('[LOGGING DETECTOR] No window, returning early');
            return;
        }

        try {
            console.log('[LOGGING DETECTOR] Getting wallets registry...');
            const walletsApi = getWalletsRegistry();
            console.log('[LOGGING DETECTOR] Got walletsApi:', !!walletsApi);

            const update = () => {
                try {
                    console.log('[LOGGING DETECTOR] update() called');
                    const ws = walletsApi.get();
                    console.log('[LOGGING DETECTOR] walletsApi.get() returned:', ws.length, 'wallets');

                    const previousCount = this.getState().wallets.length;
                    console.log('[LOGGING DETECTOR] previousCount:', previousCount);

                    const newCount = ws.length;
                    console.log('[LOGGING DETECTOR] newCount:', newCount);

                    const unique = (this as any).deduplicateWallets(ws);
                    console.log('[LOGGING DETECTOR] deduplicated:', unique.length, 'wallets');

                    const mapped = unique.map((w: any) => (this as any).mapToWalletInfo(w));
                    console.log('[LOGGING DETECTOR] mapped:', mapped.length, 'wallet infos');

                    console.log('[LOGGING DETECTOR] Calling stateManager.updateState...');
                    this.stateManager.updateState({
                        wallets: mapped,
                    });
                    console.log('[LOGGING DETECTOR] updateState completed');
                } catch (innerError) {
                    console.log('[LOGGING DETECTOR] Error in update():', innerError);
                    throw innerError;
                }
            };

            console.log('[LOGGING DETECTOR] Calling update()...');
            update();
            console.log('[LOGGING DETECTOR] update() completed');

            console.log('[LOGGING DETECTOR] Setting up event listeners...');
            (this as any).unsubscribers.push(walletsApi.on('register', update));
            (this as any).unsubscribers.push(walletsApi.on('unregister', update));

            setTimeout(() => {
                if (!this.getState().connected) {
                    update();
                }
            }, 1000);

            console.log('[LOGGING DETECTOR] initialize() completed successfully');
        } catch (e) {
            console.log('[LOGGING DETECTOR] Error in initialize():', e);
        }
    }
}

describe('WalletDetector', () => {
    let detector: WalletDetector;
    let stateManager: StateManager;
    let eventEmitter: EventEmitter;
    let eventCollector: ReturnType<typeof createEventCollector>;

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

    beforeEach(() => {
        stateManager = new StateManager(initialState);
        eventEmitter = new EventEmitter(false);
        eventCollector = createEventCollector();
        eventEmitter.on(eventCollector.collect);

        // Clear mock wallets
        mockWallets.length = 0;
        mockListeners.clear();

        // Mock window environment with navigator.wallets
        global.window = {
            navigator: {
                wallets: mockWalletsRegistry,
            } as any,
        } as Window & typeof globalThis;
    });

    afterEach(() => {
        detector?.destroy();
        // @ts-expect-error - Clean up
        delete global.window;
        vi.clearAllMocks();
    });

    describe('initialization', () => {
        it('should have mock registry accessible', () => {
            // Verify the mock setup
            expect(mockWalletsRegistry).toBeDefined();
            expect(mockWalletsRegistry.get()).toEqual([]);

            // Add a wallet and verify it's returned
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);
            expect(mockWalletsRegistry.get()).toHaveLength(1);
            expect(mockWalletsRegistry.get()[0]).toBe(wallet);
        });

        it('should update state directly', () => {
            // Test that stateManager works
            const wallet = createMockPhantomWallet();
            stateManager.updateState({
                wallets: [{
                    wallet,
                    installed: true,
                    connectable: true,
                }],
            });

            const state = stateManager.getSnapshot();
            expect(state.wallets.length).toBe(1);
        });

        it('should construct detector successfully', () => {
            expect(() => {
                detector = new WalletDetector(stateManager, eventEmitter, false);
            }).not.toThrow();
            expect(detector).toBeDefined();
        });

        it('should initialize without wallets', () => {
            detector = new WalletDetector(stateManager, eventEmitter, false);

            // Spy to verify initialize() completes
            const updateStateSpy = vi.spyOn(stateManager, 'updateState');

            detector.initialize();

            console.log('[TEST] Initialize called, updateState was called:', updateStateSpy.mock.calls.length, 'times');

            const state = stateManager.getSnapshot();
            expect(state.wallets).toEqual([]);
        });

        it('should detect wallets on initialization', async () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            // Verify window setup
            console.log('[TEST] window exists?', typeof window !== 'undefined');
            console.log('[TEST] window.navigator exists?', typeof (window as any).navigator !== 'undefined');
            console.log('[TEST] window.navigator.wallets exists?', typeof (window as any).navigator?.wallets !== 'undefined');
            console.log('[TEST] window.navigator.wallets === mockWalletsRegistry?', (window as any).navigator?.wallets === mockWalletsRegistry);
            console.log('[TEST] window.navigator.wallets.get?', typeof (window as any).navigator?.wallets?.get);

            // Manually call what getWalletsRegistry should do
            const nav = (window as any).navigator;
            console.log('[TEST] Manual check: nav.wallets?', !!nav.wallets);
            console.log('[TEST] Manual check: nav.wallets.get?', typeof nav.wallets?.get);
            if (nav.wallets && typeof nav.wallets.get === 'function') {
                const wallets = nav.wallets.get();
                console.log('[TEST] Manual nav.wallets.get() returned:', wallets.length, 'wallets');
            }

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            await new Promise(resolve => setTimeout(resolve, 100));

            const state = stateManager.getSnapshot();
            console.log('[TEST] Final state.wallets.length:', state.wallets.length);

            expect(state.wallets.length).toBe(1);
            expect(state.wallets[0].wallet.name).toBe('Phantom');
        });

        it('should emit wallets:detected event when wallets found', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            eventCollector.assertEventEmitted('wallets:detected');
            const events = eventCollector.getEventsByType('wallets:detected');
            expect(events[0].count).toBe(1);
        });

        it('should not emit event when no wallets found', () => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            const events = eventCollector.getEventsByType('wallets:detected');
            expect(events).toHaveLength(0);
        });

        it('should handle no window environment', () => {
            // @ts-expect-error - Simulating no window
            delete global.window;

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            const state = stateManager.getSnapshot();
            expect(state.wallets).toEqual([]);
        });

        it('should subscribe to wallet registry events', () => {
            const wallet = createMockPhantomWallet();

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            // Simulate wallet registration
            mockWalletsRegistry.register(wallet);

            const state = stateManager.getSnapshot();
            expect(state.wallets.length).toBeGreaterThan(0);
        });

        it('should update on wallet unregistration', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            let state = stateManager.getSnapshot();
            expect(state.wallets.length).toBe(1);

            // Simulate wallet unregistration
            mockWalletsRegistry.unregister(wallet);

            state = stateManager.getSnapshot();
            expect(state.wallets.length).toBe(0);
        });

        it('should work in debug mode', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector = new WalletDetector(stateManager, eventEmitter, true);
            expect(() => detector.initialize()).not.toThrow();
        });
    });

    describe('detectDirectWallet', () => {
        beforeEach(() => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
        });

        it('should detect wallet from window.walletName', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                connect: vi.fn(),
                disconnect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should detect wallet from window.walletNameWallet', () => {
            const mockWallet: DirectWallet = {
                name: 'Solflare',
                connect: vi.fn(),
                disconnect: vi.fn(),
            };

            (global.window as any).solflareWallet = mockWallet;

            const detected = detector.detectDirectWallet('solflare');
            expect(detected).toBe(mockWallet);
        });

        it('should detect wallet from window.solana', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                isPhantom: true,
                connect: vi.fn(),
                disconnect: vi.fn(),
            };

            (global.window as any).solana = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should verify wallet name before returning', () => {
            const wrongWallet: DirectWallet = {
                name: 'Solflare',
                connect: vi.fn(),
            };

            (global.window as any).phantom = wrongWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(null);
        });

        it('should detect wallet by pattern matching', () => {
            const mockWallet: DirectWallet = {
                name: 'CustomWallet',
                connect: vi.fn(),
            };

            (global.window as any).customWalletExtension = mockWallet;

            const detected = detector.detectDirectWallet('customWallet');
            expect(detected).toBe(mockWallet);
        });

        it('should return null for non-existent wallet', () => {
            const detected = detector.detectDirectWallet('nonexistent');
            expect(detected).toBe(null);
        });

        it('should handle no window environment', () => {
            // @ts-expect-error - Simulating no window
            delete global.window;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(null);
        });

        it('should check for standard:connect feature', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                features: {
                    'standard:connect': {},
                },
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should check for legacy connect method', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                connect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should return null if no connect capability', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(null);
        });

        it('should handle wallet with providerName', () => {
            const mockWallet: DirectWallet = {
                providerName: 'Phantom',
                connect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should handle wallet with metadata.name', () => {
            const mockWallet: DirectWallet = {
                metadata: { name: 'Phantom' },
                connect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should handle wallet with isWalletName flag', () => {
            const mockWallet: DirectWallet = {
                isPhantom: true,
                connect: vi.fn(),
            };

            (global.window as any).solana = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should handle wallet with isWalletNameWallet flag', () => {
            const mockWallet: DirectWallet = {
                isPhantomWallet: true,
                connect: vi.fn(),
            };

            (global.window as any).solana = mockWallet;

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(mockWallet);
        });

        it('should handle errors gracefully', () => {
            // Create a property that throws when accessed
            Object.defineProperty(global.window, 'phantom', {
                get: () => {
                    throw new Error('Access denied');
                },
                configurable: true,
            });

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(null);
        });

        it('should handle non-object results', () => {
            (global.window as any).phantom = 'not an object';

            const detected = detector.detectDirectWallet('phantom');
            expect(detected).toBe(null);
        });

        it('should be case-insensitive', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                connect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            const detected = detector.detectDirectWallet('PHANTOM');
            expect(detected).toBe(mockWallet);
        });
    });

    describe('getDetectedWallets', () => {
        beforeEach(() => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
        });

        it('should return empty array initially', () => {
            const wallets = detector.getDetectedWallets();
            expect(wallets).toEqual([]);
        });

        it('should return detected wallets', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets.length).toBe(1);
            expect(wallets[0].wallet.name).toBe('Phantom');
        });

        it('should return wallets with metadata', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].installed).toBe(true);
            expect(wallets[0].connectable).toBeDefined();
        });
    });

    describe('wallet mapping', () => {
        beforeEach(() => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
        });

        it('should map wallet with standard features', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].installed).toBe(true);
            expect(wallets[0].connectable).toBe(true);
        });

        it('should identify non-connectable wallet', () => {
            const wallet = createMockPhantomWallet();
            // Remove disconnect feature
            delete wallet.features['standard:disconnect'];
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].connectable).toBe(false);
        });

        it('should check for Solana chain support', () => {
            const wallet = createMockPhantomWallet();
            wallet.chains = ['ethereum:1'];
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].connectable).toBe(false);
        });

        it('should handle wallet without chains', () => {
            const wallet = createMockPhantomWallet();
            wallet.chains = [];
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].connectable).toBe(false);
        });
    });

    describe('wallet deduplication', () => {
        beforeEach(() => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
        });

        it('should deduplicate wallets by name', () => {
            const wallet1 = createMockPhantomWallet();
            const wallet2 = createMockPhantomWallet();
            wallet2.icon = 'different-icon.png';

            mockWallets.push(wallet1, wallet2);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets.length).toBe(1);
        });

        it('should keep first occurrence', () => {
            const wallet1 = createMockPhantomWallet();
            wallet1.icon = 'first-icon.png';
            const wallet2 = createMockPhantomWallet();
            wallet2.icon = 'second-icon.png';

            mockWallets.push(wallet1, wallet2);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].wallet.icon).toBe('first-icon.png');
        });

        it('should handle different wallet names', () => {
            const phantom = createMockPhantomWallet();
            const solflare = createMockPhantomWallet();
            solflare.name = 'Solflare';

            mockWallets.push(phantom, solflare);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets.length).toBe(2);
        });
    });

    describe('cleanup', () => {
        it('should cleanup subscriptions on destroy', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            expect(() => detector.destroy()).not.toThrow();

            // After destroy, registry updates shouldn't affect state
            const initialCount = stateManager.getSnapshot().wallets.length;
            mockWalletsRegistry.register(createMockPhantomWallet());
            const afterCount = stateManager.getSnapshot().wallets.length;

            expect(afterCount).toBe(initialCount);
        });

        it('should handle unsubscribe errors', () => {
            detector = new WalletDetector(stateManager, eventEmitter, false);

            // Manually add a bad unsubscriber
            (detector as any).unsubscribers.push(() => {
                throw new Error('Unsubscribe failed');
            });

            expect(() => detector.destroy()).not.toThrow();
        });

        it('should clear unsubscribers array', () => {
            const wallet = createMockPhantomWallet();
            mockWallets.push(wallet);

            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            detector.destroy();

            expect((detector as any).unsubscribers).toEqual([]);
        });

        it('should be safe to call destroy multiple times', () => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
            detector.initialize();

            expect(() => {
                detector.destroy();
                detector.destroy();
                detector.destroy();
            }).not.toThrow();
        });
    });

    describe('edge cases', () => {
        beforeEach(() => {
            detector = new WalletDetector(stateManager, eventEmitter, false);
        });

        it('should handle wallet with null features', () => {
            const wallet = createMockPhantomWallet();
            (wallet as any).features = null;
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].connectable).toBe(false);
        });

        it('should handle wallet with undefined features', () => {
            const wallet = createMockPhantomWallet();
            delete (wallet as any).features;
            mockWallets.push(wallet);

            detector.initialize();

            const wallets = detector.getDetectedWallets();
            expect(wallets[0].connectable).toBe(false);
        });

        it('should handle registry errors gracefully', () => {
            // Test that initialize doesn't throw even if the registry has issues
            // The error is caught and logged in the initialize method
            
            // Temporarily remove window to simulate environment without wallet support
            const originalWindow = global.window;
            // @ts-expect-error - Simulating no window
            delete global.window;
            
            // Create a broken window environment
            global.window = {
                navigator: {} as any,
            } as any;

            expect(() => {
                detector.initialize();
            }).not.toThrow();
            
            // Restore
            global.window = originalWindow;
        });

        it('should handle rapid wallet detection calls', () => {
            const mockWallet: DirectWallet = {
                name: 'Phantom',
                connect: vi.fn(),
            };

            (global.window as any).phantom = mockWallet;

            // Call detectDirectWallet multiple times rapidly
            const results = [
                detector.detectDirectWallet('phantom'),
                detector.detectDirectWallet('phantom'),
                detector.detectDirectWallet('phantom'),
            ];

            results.forEach(result => {
                expect(result).toBe(mockWallet);
            });
        });
    });
});
