/**
 * @connector-kit/connector - Debug Panel (Deprecated)
 *
 * The debug panel has been moved to its own package: @connector-kit/debugger
 *
 * @deprecated This file is deprecated and will be removed in a future version.
 * Install @connector-kit/debugger and import from '@connector-kit/debugger/react' instead.
 *
 * Migration:
 * 1. Install: pnpm add @connector-kit/debugger
 * 2. Update imports:
 *    - FROM: import { ConnectorDebugPanel } from '@connector-kit/connector/react'
 *    - TO:   import { ConnectorDebugPanel } from '@connector-kit/debugger/react'
 */

import { createLogger } from '../lib/utils/secure-logger';

const logger = createLogger('DebugPanel');

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    logger.warn(
        'Importing ConnectorDebugPanel from @connector-kit/connector is deprecated. ' +
            'Please install @connector-kit/debugger and import from @connector-kit/debugger/react instead. ' +
            'This export will be removed in the next major version.',
    );
}
