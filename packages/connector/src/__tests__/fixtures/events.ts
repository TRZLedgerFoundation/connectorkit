/**
 * Event test fixtures
 * 
 * Pre-configured event payloads for testing
 */

import type { ConnectorEvent } from '../../types/events';
import { TEST_ADDRESSES } from './accounts';
import { TEST_SIGNATURES } from './transactions';

/**
 * Create a mock wallet registered event
 */
export function createWalletRegisteredEvent(walletName: string = 'Phantom'): ConnectorEvent {
    return {
        type: 'wallet-registered',
        wallet: walletName,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock connecting event
 */
export function createConnectingEvent(walletName: string = 'Phantom'): ConnectorEvent {
    return {
        type: 'connecting',
        wallet: walletName,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock connected event
 */
export function createConnectedEvent(
    walletName: string = 'Phantom',
    accounts: string[] = [TEST_ADDRESSES.ACCOUNT_1],
): ConnectorEvent {
    return {
        type: 'connected',
        wallet: walletName,
        accounts,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock disconnected event
 */
export function createDisconnectedEvent(walletName: string = 'Phantom'): ConnectorEvent {
    return {
        type: 'disconnected',
        wallet: walletName,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock account changed event
 */
export function createAccountChangedEvent(account: string = TEST_ADDRESSES.ACCOUNT_1): ConnectorEvent {
    return {
        type: 'account-changed',
        account,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock accounts changed event
 */
export function createAccountsChangedEvent(accounts: string[] = [TEST_ADDRESSES.ACCOUNT_1]): ConnectorEvent {
    return {
        type: 'accounts-changed',
        accounts,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock transaction sent event
 */
export function createTransactionSentEvent(signature: string = TEST_SIGNATURES.TX_1): ConnectorEvent {
    return {
        type: 'transaction-sent',
        signature,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Create a mock error event
 */
export function createErrorEvent(error: string = 'Test error', code?: string): ConnectorEvent {
    return {
        type: 'error',
        error,
        code,
        timestamp: new Date().toISOString(),
    };
}

