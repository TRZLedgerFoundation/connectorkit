/**
 * @trezoa/connector - Debug Panel (Deprecated)
 *
 * The debug panel has been moved to its own package: @trezoa/connector-debugger
 *
 * @deprecated This file is deprecated and will be removed in a future version.
 * Install @trezoa/connector-debugger and import from '@trezoa/connector-debugger/react' instead.
 *
 * Migration:
 * 1. Install: pnpm add @trezoa/connector-debugger
 * 2. Update imports:
 *    - FROM: import { ConnectorDebugPanel } from '@trezoa/connector/react'
 *    - TO:   import { ConnectorDebugPanel } from '@trezoa/connector-debugger/react'
 */

import { createLogger } from '../lib/utils/secure-logger';

const logger = createLogger('DebugPanel');

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    logger.warn(
        'Importing ConnectorDebugPanel from @trezoa/connector is deprecated. ' +
            'Please install @trezoa/connector-debugger and import from @trezoa/connector-debugger/react instead. ' +
            'This export will be removed in the next major version.',
    );
}
