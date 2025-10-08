# @connector-kit/debugger

Development debug panel for `@connector-kit/connector`.

## Features

- 📊 **Overview Tab**: Comprehensive status dashboard
- 📝 **Transactions Tab**: Real-time transaction tracking with explorer links
- 📡 **Events Tab**: Real-time event stream with pause/clear controls

## Installation

```bash
npm install @connector-kit/debugger
# or
pnpm add @connector-kit/debugger
# or
yarn add @connector-kit/debugger
```

## Usage

```tsx
import { AppProvider } from '@connector-kit/connector/react'
import { ConnectorDebugPanel } from '@connector-kit/debugger/react'
import { getDefaultConfig } from '@connector-kit/connector/headless'

function App() {
  const config = getDefaultConfig({
    appName: 'My App',
    appUrl: 'https://myapp.com'
  })

  return (
    <AppProvider connectorConfig={config}>
      {/* Your app */}
      
      {/* Debug panel - only visible in development */}
      {process.env.NODE_ENV === 'development' && <ConnectorDebugPanel />}
    </AppProvider>
  )
}
```

## Props

```tsx
interface DebugPanelProps {
  /** Position of the debug panel on screen (default: 'bottom-right') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  
  /** Whether to show the panel expanded by default (default: false) */
  defaultOpen?: boolean
  
  /** Default tab to show (default: 'overview') */
  defaultTab?: 'overview' | 'transactions' | 'events'
  
  /** Custom styles for the panel container */
  style?: React.CSSProperties
  
  /** z-index for the panel (default: 9999) */
  zIndex?: number
  
  /** Maximum number of events to keep in history (default: 50) */
  maxEvents?: number
}
```

## Important Notes

- **Development Only**: The debug panel automatically excludes itself from production builds when `process.env.NODE_ENV !== 'development'`
- **Requires Connector Provider**: Must be used within `AppProvider` or `ConnectorProvider` from `@connector-kit/connector`

## License

MIT

