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

if (typeof console !== 'undefined' && process.env.NODE_ENV === 'development') {
	console.warn(
		'[@connector-kit/connector] Importing ConnectorDebugPanel from @connector-kit/connector is deprecated.\n' +
		'Please install @connector-kit/debugger and import from @connector-kit/debugger/react instead.\n' +
		'This export will be removed in the next major version.'
	)
}
