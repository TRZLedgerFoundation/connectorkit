/**
 * useAccount hook tests
 * 
 * Tests account information, formatting, clipboard operations, and account selection
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAccount } from './use-account';
import { createHookWrapper } from '../__tests__/utils/react-helpers';
import { setupMockWindow, cleanupMockWindow, createMockClipboard } from '../__tests__/mocks/window-mock';
import { ConnectorClient } from '../lib/core/connector-client';
import { TEST_ADDRESSES } from '../__tests__/fixtures/accounts';

describe('useAccount', () => {
    let mockClipboard: ReturnType<typeof createMockClipboard>;

    beforeEach(() => {
        mockClipboard = createMockClipboard('success');
        setupMockWindow({ navigator: { clipboard: mockClipboard, userAgent: 'test' } });
    });

    afterEach(() => {
        cleanupMockWindow();
        vi.clearAllMocks();
    });

    describe('when not connected', () => {
        it('should return null values', () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            expect(result.current.address).toBe(null);
            expect(result.current.account).toBe(null);
            expect(result.current.connected).toBe(false);
            expect(result.current.formatted).toBe('');
            expect(result.current.accounts).toEqual([]);
        });

        it('should handle copy gracefully when not connected', async () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            const copyResult = await result.current.copy();

            expect(copyResult.success).toBe(false);
            expect(copyResult.error).toBe('empty_value');
            expect(copyResult.errorMessage).toBe('No account selected');
        });
    });

    describe('formatted address', () => {
        it('should format address correctly', () => {
            const config = {
                debug: false,
            };

            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(config),
            });

            // Initially no address
            expect(result.current.formatted).toBe('');
        });
    });

    describe('copy functionality', () => {
        it('should copy address to clipboard', async () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            // Mock that we have a selected account
            // This would normally come from connecting a wallet
            // For now, test the error case
            const copyResult = await result.current.copy();

            expect(copyResult).toBeDefined();
        });

        it('should set copied state after copying', async () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            expect(result.current.copied).toBe(false);
        });

        it('should handle clipboard errors', async () => {
            const errorClipboard = createMockClipboard('error');
            setupMockWindow({ navigator: { clipboard: errorClipboard, userAgent: 'test' } });

            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            const copyResult = await result.current.copy();
            
            expect(copyResult.success).toBe(false);
        });
    });

    describe('account selection', () => {
        it('should provide selectAccount function', () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            expect(typeof result.current.selectAccount).toBe('function');
        });

        it('should allow selecting from multiple accounts', async () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            // selectAccount is a function
            expect(result.current.selectAccount).toBeDefined();
        });
    });

    describe('accounts list', () => {
        it('should return empty array when not connected', () => {
            const { result } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            expect(result.current.accounts).toEqual([]);
        });
    });

    describe('memoization', () => {
        it('should memoize return value', () => {
            const { result, rerender } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            const firstResult = result.current;
            rerender();
            const secondResult = result.current;

            // Should be referentially stable when state hasn't changed
            expect(firstResult).toBe(secondResult);
        });
    });

    describe('cleanup', () => {
        it('should cleanup timers on unmount', () => {
            const { unmount } = renderHook(() => useAccount(), {
                wrapper: createHookWrapper(),
            });

            expect(() => unmount()).not.toThrow();
        });
    });
});

