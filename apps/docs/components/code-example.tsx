'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { CopyButton } from './ui/copy-button'

const codeExamples = {
  overview: `// 🚀 Arc SDK - High-Level API Overview
// The React hooks library for Solana - making blockchain development as simple as React state

// ===== THE ARC ARCHITECTURE =====

// 🏗️ FOUNDATION: Context-First Provider System
<ArcProvider config={{ rpcUrl, network, autoConnect }}>
  <YourApp /> {/* All components get shared state automatically */}
</ArcProvider>

// ===== THREE LEVELS OF PROGRESSIVE COMPLEXITY =====

// 🎯 LEVEL 1: Basic Operations (Most Users)
const { wallet, network } = useArcClient()  // Single unified hook
const balance = useBalance()                 // SOL/token balances  
const airdrop = useAirdrop()                // Devnet SOL faucet
const transaction = useTransaction()        // Send transactions

// 🎉 LEVEL 2: Typed Program Accounts (Intermediate)
const mint = useMint({ mintAddress })       // Token mint data with built-in codec
const account = useProgramAccount({ 
  program: 'mint'                          // Built-in codecs: mint, stake, vote, system
})

// 🚀 LEVEL 3: Schema Validation + Custom Codecs (Power Users)  
const validatedAccount = useAccount({
  schema: AccountSchema,                   // Zod schema validation
  onValidationSuccess: (data) => {...}
})
const customAccount = useProgramAccount({
  codec: async (rpc, address) => {
    // Parse ANY program account with custom logic
    return { /* your parsed data */ }
  }
})

// ===== CONTEXT RELATIONSHIPS =====

// 🔗 AUTO-COORDINATION: Everything from one unified client
function Component() {
  const { wallet, network } = useArcClient()         // ← Single source of truth
  const { balance } = useBalance()                    // ← Auto-uses wallet address
  const { sendTransaction } = useTransaction()       // ← Auto-uses wallet signer
  
  // Everything coordinates automatically - no prop drilling!
}

// ===== PROVIDER EXTENSIBILITY =====

// 🔌 MODULAR PROVIDERS: Extend functionality
const jupiter = createJupiterProvider({ slippage: 0.5 })
const orca = createOrcaProvider({ pools: 'all' })

<ArcProvider config={{
  providers: [
    createProvider({ swap: [jupiter, orca] }),
    createProvider({ lending: [solend, mango] }),  // Future
    createProvider({ staking: [marinade] })        // Future  
  ]
}}>

// 🎯 PROVIDER-AWARE HOOKS: Access extended functionality
const swap = useSwap({ providers: ['jupiter', 'orca'] })
const lending = useLending({ protocol: 'solend' })  // Future

// ===== KEY DESIGN PRINCIPLES =====

// ✅ Zero Props: Components get state from context automatically
// ✅ Progressive Complexity: Simple → Typed → Custom codecs
// ✅ Type Safety: Full TypeScript integration with @solana/kit
// ✅ Auto-Coordination: Hooks share wallet, network, RPC automatically  
// ✅ Modern Standards: Wallet Standard, Kit 2.0, React Query
// ✅ Extensible: Provider system for DeFi protocols
// ✅ Performance: Built-in caching, optimized re-renders

// ===== THE ARC WAY =====

// Traditional Solana development:
// - Manual RPC client setup
// - Manual wallet adapter coordination  
// - Manual account parsing & type casting
// - Manual state management between components
// - Verbose error handling

// Arc SDK approach:
// - Context handles all coordination automatically
// - Kit 2.0 provides type-safe building blocks
// - Progressive complexity serves all skill levels
// - Modern React patterns with hooks & suspense
// - "Just works" developer experience

// 🎯 RESULT: Solana development as simple as React state management`,

  setup: `// 1. Setup Arc Provider (QueryClient Handled Automatically)
import { ArcProvider } from '@arc/solana'

// ✅ SIMPLE SETUP: ArcProvider handles QueryClient internally
export default function App() {
  return (
    <ArcProvider config={{ 
      rpcUrl: 'https://api.devnet.solana.com',
      network: 'devnet',
      autoConnect: false
    }}>
      <YourSolanaApp />
    </ArcProvider>
  )
}

// ✅ ADVANCED SETUP: Custom QueryClient (optional)
import { QueryClient } from '@tanstack/react-query'

function AppWithCustomQuery() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
        refetchOnWindowFocus: false
      }
    }
  })

  return (
    <ArcProvider config={{ 
      rpcUrl: 'https://api.devnet.solana.com',
      network: 'devnet',
      queryClient  // ← ArcProvider uses this internally
    }}>
      <YourSolanaApp />
    </ArcProvider>
  )
}`,

  wallet: `// 2. Context-Aware Wallet Connection (Zero Props!)
import { useArcClient } from '@arc/solana'

function WalletComponent() {
  // 🎉 NEW unified hook: Everything from one place
  const { 
    wallet: {
      wallets,           // StandardWalletInfo[]: all detected wallets
      connecting,        // boolean: connection in progress  
      connected,         // boolean: wallet connection status
      address,           // string: connected wallet address
      signer,            // TransactionSigner: for signing transactions
      selectedWallet     // Wallet: currently connected wallet
    },
    select,              // function: connect to specific wallet
    disconnect           // function: disconnect wallet
  } = useArcClient()

  return (
    <div>
      <h3>Wallet Status: {connected ? 'Connected' : 'Disconnected'}</h3>

      {/* Auto-detected wallet selection */}
      {!connected && wallets.map((wallet) => (
        <div key={wallet.name}>
          <span>{wallet.name}</span>
          <button 
          onClick={() => select(wallet.name)}
            disabled={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      ))}

      {/* Connected wallet info */}
      {connected && (
        <div>
          <p>Wallet: {selectedWallet?.name}</p>
          <p>Address: {address?.slice(0, 6)}...{address?.slice(-6)}</p>
          <p>Signer: {signer ? '✅ Ready' : '❌ Not Ready'}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}

      {wallets.length === 0 && (
        <p>No wallets detected. Install Phantom, Backpack, or Solflare.</p>
      )}
    </div>
  )
}`,

  balance: `// 3. Auto-Address Balance (Magic Simplicity!)
import { useBalance, useArcClient } from '@arc/solana'

function BalanceComponent() {
  // 🎉 AUTO-ADDRESS: Automatically uses connected wallet
  const { 
    balance,        // Lamports: raw balance as BigInt
    isLoading,      // boolean: fetching state
    error,          // Error | null: any fetch errors
    refetch         // function: manually refetch balance
  } = useBalance()  // ← No address needed! Uses context automatically

  const { wallet: { address, connected } } = useArcClient()

  if (!connected) return <div>Connect wallet to see balance</div>
  if (isLoading) return <div>Loading balance...</div>
  if (error) return <div>Error: {error.message} <button onClick={refetch}>Retry</button></div>

  return (
    <div>
      <h3>{(Number(balance) / 1e9).toFixed(4)} SOL</h3>
      <p>Raw: {balance.toString()} lamports</p>
      <p>Address: {address?.slice(0, 6)}...{address?.slice(-6)}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  )
}

// Alternative: Manual address override (for advanced use cases)
function MultiAddressBalance() {
  const { balance: walletBalance } = useBalance() // Connected wallet
  const { balance: customBalance } = useBalance({ 
    address: 'SomeOtherAddress...' // Specific address
  })

  return (
    <div>
      <p>My Balance: {walletBalance ? (Number(walletBalance) / 1e9).toFixed(4) : '0'} SOL</p>
      <p>Other Balance: {customBalance ? (Number(customBalance) / 1e9).toFixed(4) : '0'} SOL</p>
    </div>
  )
}`,

  airdrop: `// 4. Context-Aware Airdrop (Network Smart!)
import { useAirdrop, useBalance, useArcClient } from '@arc/solana'

function AirdropComponent() {
  // 🎉 ALL CONTEXT-AWARE: No manual coordination needed
  const { 
    wallet: { address, signer, connected },
    network: { isDevnet, canAirdrop }
  } = useArcClient()
  const { balance, refetch: refetchBalance } = useBalance() // Auto-uses wallet address
  
  const { 
    requestAirdrop,     // function: request SOL from devnet faucet
    isLoading,          // boolean: airdrop in progress
    error,              // Error | null: any airdrop errors
    data                // AirdropResult | null: success data
  } = useAirdrop()

  const handleAirdrop = async () => {
    if (!address || !signer) return
    
    try {
      // 🎉 AUTO-ADDRESS: Uses connected wallet automatically
      await requestAirdrop(address)
      
      // Auto-refresh balance after airdrop
      setTimeout(() => refetchBalance(), 4000)
      
    } catch (error) {
      console.error('Airdrop error:', error)
      // Error handled by hook's error state
    }
  }

  // Smart network detection
  if (!isDevnet) {
    return (
      <div style={{ color: '#dc2626', padding: '10px' }}>
        ⚠️ Airdrops only available on devnet. You're on {isDevnet ? 'devnet' : 'mainnet'}.
      </div>
    )
  }

  if (!connected) {
    return <div>Connect wallet to request airdrop</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Smart airdrop button - only show if balance is 0 */}
      {Number(balance) === 0 && canAirdrop && (
        <button 
          onClick={handleAirdrop}
          disabled={isLoading || !signer}
          style={{
            padding: '10px 20px',
            backgroundColor: !signer ? '#ccc' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: !signer ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Requesting SOL...' : '💧 Get 1 SOL (Devnet)'}
        </button>
      )}

      {/* Network-aware messaging */}
      {!canAirdrop && (
        <div style={{ color: '#666', fontSize: '14px' }}>
          ℹ️ Airdrops not available on this network
        </div>
      )}
      
      {/* Error with helpful context */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <p style={{ fontWeight: 'bold' }}>Airdrop Failed</p>
          <p>{error.message}</p>
          {error.message.includes('rate') && (
            <p style={{ fontSize: '12px', marginTop: '5px' }}>
              💡 Devnet faucets have rate limits. Try again in a few minutes.
            </p>
          )}
        </div>
      )}
      
      {/* Success message */}
      {data && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '8px',
          color: '#15803d'
        }}>
          🪂 Airdrop successful! {Number(data.amount) / 1e9} SOL sent
        </div>
      )}
    </div>
  )
}`,

  cluster: `// 5. Network Detection & Smart Adaptation
import { useArcClient } from '@arc/solana'

function NetworkComponent() {
  const { 
    network: {
      rpcUrl,          // Current RPC endpoint
      isDevnet,        // true if on devnet
      isMainnet,       // true if on mainnet
      canAirdrop       // true if airdrops supported
    },
    wallet: { connected, address }
  } = useArcClient()

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      {/* Network Status */}
      <div style={{ marginBottom: '15px' }}>
        <h3>🌐 Network Status</h3>
        <p style={{ 
          padding: '5px 10px', 
          backgroundColor: isMainnet ? '#fecaca' : isDevnet ? '#bbf7d0' : '#e5e7eb',
          color: isMainnet ? '#7f1d1d' : isDevnet ? '#14532d' : '#374151',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          {isMainnet ? 'Mainnet' : isDevnet ? 'Devnet' : 'Custom Network'}
        </p>
      </div>

      {/* Network Info */}
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f9fafb', 
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <p><strong>RPC:</strong> {rpcUrl}</p>
        <p><strong>Supports Airdrops:</strong> {canAirdrop ? '✅ Yes' : '❌ No'}</p>
        {connected && (
          <p><strong>Wallet:</strong> {address?.slice(0, 6)}...{address?.slice(-6)}</p>
        )}
      </div>

      {/* Network-specific Warnings */}
      {isMainnet && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ color: '#7f1d1d', fontWeight: 'bold' }}>⚠️ You're on Mainnet!</p>
          <p style={{ color: '#991b1b', fontSize: '14px' }}>Real transactions with real SOL</p>
        </div>
      )}

      {isDevnet && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #86efac',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ color: '#14532d', fontWeight: 'bold' }}>✅ Safe Development Environment</p>
          <p style={{ color: '#15803d', fontSize: '14px' }}>Free SOL available for testing</p>
        </div>
      )}
    </div>
  )
}

// Example: Conditional features based on network
function AdaptiveFeatures() {
  const { 
    network: { isMainnet, canAirdrop, isDevnet },
    wallet: { connected }
  } = useArcClient()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Only show airdrop on networks that support it */}
      {connected && canAirdrop && (
        <button style={{
          padding: '8px 12px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}>
          💧 Get Free SOL
        </button>
      )}
      
      {/* Show different UI based on network */}
      {isMainnet && (
        <div style={{ color: '#dc2626', fontSize: '14px', fontWeight: 'bold' }}>
          ⚠️ Mainnet detected - real money at risk!
        </div>
      )}
      
      {isDevnet && (
        <div style={{ color: '#059669', fontSize: '14px' }}>
          🧪 Development mode - safe to experiment
        </div>
      )}
      
      <p style={{ fontSize: '12px', color: '#6b7280' }}>
        Features automatically adapt to your network
      </p>
    </div>
  )
}`,

  transaction: `// 6. Auto-Signer Transactions (Zero Configuration!)
import { useTransaction, useBalance, useArcClient } from '@arc/solana'
import { getTransferSolInstruction } from '@solana-program/system'
import { address, lamports } from '@solana/kit'

function TransferComponent() {
  // 🎉 EVERYTHING FROM CONTEXT: No manual coordination
  const { wallet: { address: walletAddress, signer, connected } } = useArcClient()
  const { balance, refetch: refetchBalance } = useBalance() // Auto-uses wallet address
  
  const { 
    sendTransaction,    // function: send SOL transfer
    isLoading,          // boolean: transaction in progress
    error,              // Error | null: transaction errors
    data                // TransactionResult | null: success data
  } = useTransaction() // Auto-uses wallet signer!

  const handleTransfer = async () => {
    if (!walletAddress || !signer) return

    const transferAmount = BigInt(0.001 * 1e9) // 0.001 SOL
    if (balance < transferAmount) {
      alert(\`Insufficient balance! You have \${(Number(balance) / 1e9).toFixed(4)} SOL\`)
      return
    }

    try {
      // Create transfer instruction
      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address('11111111111111111111111111111111'), // Burn address
        amount: lamports(transferAmount),
      })
      
      // 🎉 NO CONFIG NEEDED! Auto-uses connected wallet as fee payer
      const result = await sendTransaction({
        instructions: [transferInstruction]
        // ← That's it! No \`config: { feePayer: signer }\` needed
      })
      
      console.log('✅ Transfer successful!')
      console.log('📋 Signature:', result.signature)
      
      // Auto-refresh balance after successful transfer
      setTimeout(() => refetchBalance(), 2000)
      
    } catch (error) {
      console.error('❌ Transfer failed:', error)
    }
  }

  const canTransfer = connected && signer && balance > BigInt(0.001 * 1e9)

  if (!connected) return <div>Connect wallet to send transactions</div>

  return (
    <div>
      <h3>Transfer 0.001 SOL</h3>
      <p>Available: {(Number(balance) / 1e9).toFixed(4)} SOL</p>
      <p>Fee Payer: {signer ? 'Auto (Connected Wallet)' : 'Not Ready'}</p>
      
      <button onClick={handleTransfer} disabled={isLoading || !canTransfer}>
        {isLoading ? 'Sending...' : 'Send 0.001 SOL'}
      </button>
      
      {error && <div>Error: {error.message}</div>}
      {data && <div>✅ Sent! Signature: {data.signature.slice(0, 8)}...</div>}
    </div>
  )
}

// Advanced: Manual signer override (for multi-sig, etc.)
function AdvancedTransfer() {
  const { sendTransaction } = useTransaction()
  const customSigner = null // Your custom signer

  const handleAdvancedTransfer = async () => {
    // Override auto-signer for advanced use cases
    await sendTransaction({
      instructions: [...],
      config: {
        feePayer: customSigner,     // Override context signer
        computeUnitLimit: 200000,   // Performance tuning
        skipPreflight: true         // Advanced options
      }
    })
  }

  return <button onClick={handleAdvancedTransfer}>Advanced Transfer</button>
}`,

  mint: `// 🎉 Arc Level 2: Typed Program Accounts (Mint Data Magic!)
import { useMint, useProgramAccount } from '@arc/solana'

// Level 2 Example 1: Built-in useMint hook (easiest)
function TokenMintAnalyzer() {
  // 🔥 LEVEL 2 MAGIC: Kit codec integration for typed program accounts
  const { mint, isLoading, error, exists } = useMint({ 
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  })

  if (isLoading) return <div>Loading mint data...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!exists) return <div>Mint not found</div>

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h3>🪙 USDC Mint Analysis (Built-in Hook)</h3>
      
      {/* ✨ TYPED DATA: All properly typed by Kit codecs */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <p><strong>Total Supply:</strong> {
          mint ? (Number(mint.supply) / Math.pow(10, mint.decimals)).toLocaleString() : 'Loading...'
        }</p>
        <p><strong>Decimals:</strong> {mint?.decimals ?? 'Loading...'}</p>
        
        {/* 🎯 OPTION TYPES: Kit handles Rust Option<T> properly */}
        <p><strong>Mint Authority:</strong> {
          mint?.mintAuthority?.__option === 'None' 
            ? '🔒 Disabled (Fixed Supply)' 
            : \`✅ \${mint?.mintAuthority?.value?.slice(0, 6)}...\${mint?.mintAuthority?.value?.slice(-6)}\`
        }</p>
        
        <p><strong>Freeze Authority:</strong> {
          mint?.freezeAuthority?.__option === 'None'
            ? '🔓 No Freeze Authority'
            : \`❄️ \${mint?.freezeAuthority?.value?.slice(0, 6)}...\${mint?.freezeAuthority?.value?.slice(-6)}\`
        }</p>
        
        <p><strong>Is Initialized:</strong> {
          mint?.isInitialized ? '✅ Yes' : '❌ No'
        }</p>
      </div>
    </div>
  )
}

// Level 2 Example 2: Generic useProgramAccount with built-in codec
function ProgramAccountMintExample() {
  const { data: mintData, isLoading, error } = useProgramAccount({
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    program: 'mint' // Built-in codec handles parsing
  })

  if (isLoading) return <div>Loading with program account...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div style={{ padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px' }}>
      <h4>🔧 useProgramAccount with Built-in Codec</h4>
      <p>Supply: {mintData ? Number(mintData.supply).toLocaleString() : 'N/A'}</p>
      <p>Decimals: {mintData?.decimals ?? 'N/A'}</p>
      <p>Authority: {mintData?.mintAuthority?.__option === 'None' ? '🔒 Fixed' : '✅ Active'}</p>
      </div>
  )
}

// Multiple Mint Comparison - Shows Level 2 simplicity
function MintComparison() {
  // Level 2: Zero-config, just works with built-in codecs
  const { mint: usdcMint } = useMint({ 
    mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  })
  const { mint: wsolMint } = useMint({ 
    mintAddress: 'So11111111111111111111111111111111111111112' // Wrapped SOL
  })

  return (
    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
      <div style={{ padding: '15px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>USDC</h4>
        <p>Supply: {usdcMint ? (Number(usdcMint.supply) / 1e6).toLocaleString() : 'Loading...'}</p>
        <p>Decimals: {usdcMint?.decimals ?? 'Loading...'}</p>
        <p style={{ fontSize: '12px', color: '#92400e' }}>Level 2: Built-in codec</p>
      </div>
      <div style={{ padding: '15px', backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#92400e' }}>Wrapped SOL</h4>
        <p>Supply: {wsolMint ? (Number(wsolMint.supply) / 1e9).toLocaleString() : 'Loading...'}</p>
        <p>Decimals: {wsolMint?.decimals ?? 'Loading...'}</p>
        <p style={{ fontSize: '12px', color: '#92400e' }}>Level 2: Built-in codec</p>
      </div>
    </div>
  )
}`,

  level3: `// 🚀 Arc Level 3: Generic Program Accounts + Schema Validation
import { useState } from 'react'
import { useAccount, useProgramAccount, type CustomCodec, AddressSchema } from '@arc/solana'
import { type Address, createSolanaRpc } from '@solana/kit'
import { z } from 'zod'

// 🎯 BUILT-IN CODECS: For common programs  
function MintAccountWithBuiltIn() {
  const { data: mintData, isLoading, error } = useProgramAccount({
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    program: 'mint' // Built-in codec handles all the parsing
  })

  if (isLoading) return <div>Loading mint account...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <h4>🪙 Built-in Mint Codec (Level 2)</h4>
      <p>Supply: {mintData?.supply ? Number(mintData.supply).toLocaleString() : 'N/A'}</p>
      <p>Decimals: {mintData?.decimals ?? 'N/A'}</p>
      <p>Mint Authority: {mintData?.mintAuthority?.__option === 'None' ? '🔒 Fixed Supply' : '✅ Active'}</p>
    </div>
  )
}

// 🔥 SCHEMA VALIDATION: Add type safety with Zod
function AccountWithSchemaValidation() {
  // Define a Zod schema for account validation
  const AccountSchema = z.object({
    address: AddressSchema,
    lamports: z.bigint().min(0n),
    owner: AddressSchema,
    executable: z.boolean(),
    data: z.instanceof(Uint8Array).nullable()
  })

  const { 
    account,        // Raw account data
    data,           // Schema-validated data  
    validation,     // Validation result
    isLoading, 
    error 
  } = useAccount({
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
    schema: AccountSchema, // Level 3: Runtime validation
    onValidationSuccess: (validData) => console.log('✅ Valid account:', validData),
    onValidationError: (err) => console.error('❌ Invalid data:', err)
  })

  if (isLoading) return <div>Loading & validating account...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f0f9ff', 
      border: '1px solid #0ea5e9',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#0c4a6e', margin: '0 0 10px 0' }}>
        🛡️ Schema Validation (Level 3)
      </h4>
      <p><strong>Raw Data:</strong> {account ? '✅ Available' : '❌ None'}</p>
      <p><strong>Validated Data:</strong> {data ? '✅ Valid' : '❌ Invalid'}</p>
      <p><strong>Validation Status:</strong> {
        validation?.success ? '🟢 Passed' : '🔴 Failed'
      }</p>
      {data && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <p>• Lamports: {data.lamports.toString()}</p>
          <p>• Owner: {data.owner.slice(0, 8)}...{data.owner.slice(-8)}</p>
          <p>• Executable: {data.executable ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  )
}

// 🚀 CUSTOM CODEC: Parse any program account
function CustomProgramAccountParser() {
  // Custom codec example for parsing any account
  const customCodec: CustomCodec<any> = async (rpc, address) => {
    const accountInfo = await rpc.getAccountInfo(address).send()
    
    if (!accountInfo?.value) {
      throw new Error('Account not found')
    }

    return {
      type: 'Custom Parsed Account',
      address: address,
      owner: accountInfo.value.owner,
      lamports: accountInfo.value.lamports,
      dataLength: accountInfo.value.data ? accountInfo.value.data.length : 0,
      executable: accountInfo.value.executable,
      analysis: {
        isTokenMint: accountInfo.value.owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        isProgramAccount: accountInfo.value.executable,
        hasData: accountInfo.value.data && accountInfo.value.data.length > 0
      },
      parsedAt: new Date().toISOString()
    }
  }

  const { data, isLoading, error } = useProgramAccount({
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC mint
    codec: customCodec // Level 3: Custom parsing logic
  })

  if (isLoading) return <div>Parsing with custom codec...</div>
  if (error) return <div>Parse error: {error.message}</div>

  return (
        <div style={{
          padding: '15px',
          backgroundColor: '#fefce8',
          border: '1px solid #facc15',
      borderRadius: '8px'
    }}>
      <h4 style={{ color: '#a16207', margin: '0 0 10px 0' }}>
        ⚡ Custom Codec (Level 3)
      </h4>
      <p><strong>Type:</strong> {data?.type}</p>
      <p><strong>Owner:</strong> {data?.owner?.slice(0, 8)}...{data?.owner?.slice(-8)}</p>
      <p><strong>Lamports:</strong> {data?.lamports ? Number(data.lamports).toLocaleString() : 'N/A'}</p>
      <p><strong>Data Length:</strong> {data?.dataLength} bytes</p>
      <p><strong>Token Mint:</strong> {data?.analysis?.isTokenMint ? '✅ Yes' : '❌ No'}</p>
      <p style={{ fontSize: '12px', color: '#92400e', marginTop: '10px' }}>
        🔧 Parsed at: {data?.parsedAt}
      </p>
    </div>
  )
}`,

  complete: `// 🚀 Complete Arc Integration - The Arc Way
import { 
  ArcProvider, 
  useArcClient,
  useBalance, 
  useAirdrop,
  useTransaction
} from '@arc/solana'
import { getTransferSolInstruction } from '@solana-program/system'
import { address, lamports } from '@solana/kit'
import { QueryClient } from '@tanstack/react-query'

// 🎯 ZERO PROPS COMPONENT: Everything from context
function SolanaWallet() {
  // 🎉 NEW useArcClient: Single hook for all state
  const { 
    wallet: { 
      wallets, connected, connecting, address: walletAddress, 
      signer, selectedWallet 
    },
    network: { isDevnet, canAirdrop },
    select,
    disconnect
  } = useArcClient()
  
  const { balance, isLoading: balanceLoading, refetch: refetchBalance } = useBalance()
  const { requestAirdrop, isLoading: airdropLoading, data: airdropResult } = useAirdrop()
  const { sendTransaction, isLoading: txLoading } = useTransaction()

  const handleAirdrop = async () => {
    if (!walletAddress || !signer) return
    try {
      await requestAirdrop(walletAddress) // Auto-uses connected address
      setTimeout(() => refetchBalance(), 4000)
    } catch (error) {
      console.error('Airdrop failed:', error)
    }
  }

  const handleTransfer = async () => {
    if (!walletAddress || !signer) return
    try {
      const transferInstruction = getTransferSolInstruction({
        source: signer,
        destination: address('11111111111111111111111111111111'),
        amount: lamports(BigInt(0.001 * 1e9)),
      })
      
      // 🎉 MAGIC: No config needed - auto-uses connected wallet
      const result = await sendTransaction({
        instructions: [transferInstruction]
      })
      
      console.log('✅ Transfer successful:', result.signature)
      setTimeout(() => refetchBalance(), 2000)
    } catch (error) {
      console.error('❌ Transfer failed:', error)
    }
  }

  const formatBalance = (lamports: bigint) => {
    return (Number(lamports) / 1e9).toFixed(4)
  }

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 6) + '...' + addr.slice(-6)
  }

  return (
    <div style={{ padding: '30px', maxWidth: '500px' }}>
      {/* Header with network awareness */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          💳 Arc Wallet Demo
        </h3>
        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
          Network: {isDevnet ? '🧪 Devnet' : '🔴 Mainnet'} | 
          Status: {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
        </p>
      </div>

      {/* Wallet Selection - Auto-detected wallets */}
      {!connected && wallets.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select a wallet:</p>
          {wallets.map((wallet) => (
            <div key={wallet.name} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={wallet.icon} alt={wallet.name} width="24" height="24" />
                <span>{wallet.name}</span>
              </div>
              <button 
                onClick={() => select(wallet.name)}
                disabled={connecting}
                style={{
                  padding: '6px 12px',
                  backgroundColor: connecting ? '#ccc' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: connecting ? 'not-allowed' : 'pointer'
                }}
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Wallet Details - Auto-coordinated */}
      {connected && walletAddress && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p><strong>Wallet:</strong> {selectedWallet?.name}</p>
          <p><strong>Address:</strong> {truncateAddress(walletAddress)}</p>
          <p><strong>Balance:</strong> {
            balanceLoading ? 'Loading...' : 
            formatBalance(balance) + ' SOL'
          }</p>
          <p><strong>Signer:</strong> {signer ? '✅ Ready' : '❌ Not Available'}</p>
        </div>
      )}

      {/* Actions - Context-aware */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        {connected ? (
          <>
            <button 
              onClick={disconnect}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
            
            <button 
              onClick={refetchBalance} 
              disabled={balanceLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: balanceLoading ? '#ccc' : '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: balanceLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {balanceLoading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
            
            {/* Smart airdrop - only on devnet with 0 balance */}
            {Number(balance) === 0 && canAirdrop && (
              <button 
                onClick={handleAirdrop} 
                disabled={airdropLoading || !signer}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (airdropLoading || !signer) ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (airdropLoading || !signer) ? 'not-allowed' : 'pointer'
                }}
              >
                {airdropLoading ? 'Requesting...' : '💧 Get 1 SOL'}
              </button>
            )}
            
            {/* Smart transfer - only with sufficient balance */}
            {Number(balance) > 0.001 * 1e9 && (
              <button 
                onClick={handleTransfer} 
                disabled={txLoading || !signer}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (txLoading || !signer) ? '#ccc' : '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (txLoading || !signer) ? 'not-allowed' : 'pointer'
                }}
              >
                {txLoading ? 'Sending...' : 'Send 0.001 SOL'}
              </button>
            )}
          </>
        ) : wallets.length === 0 ? (
          <p style={{ color: '#666' }}>
            No wallets detected. Install Phantom, Backpack, or Solflare.
          </p>
        ) : null}
      </div>

      {/* Success message */}
      {airdropResult && (
        <div style={{
          padding: '12px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '10px'
        }}>
          🪂 Airdrop successful! {Number(airdropResult.amount) / 1e9} SOL received
        </div>
      )}
    </div>
  )
}

// 🚀 Production setup - ArcProvider handles everything
export default function App() {
  return (
    <ArcProvider config={{ 
      rpcUrl: 'https://api.devnet.solana.com',
      network: 'devnet',
      autoConnect: false
    }}>
      <SolanaWallet />
    </ArcProvider>
  )
}

// Alternative: Custom QueryClient for advanced caching needs
function AppWithCustomCaching() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        staleTime: 10 * 60 * 1000, // 10 minutes for production
        retry: 3,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
      }
    }
  })

  return (
    <ArcProvider config={{ 
      rpcUrl: 'https://api.mainnet-beta.solana.com', // Production RPC
      network: 'mainnet',
      queryClient // ArcProvider uses this internally
    }}>
      <SolanaWallet />
    </ArcProvider>
  )
}`
}

export function CodeExample() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="h-full w-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Arc SDK</h2>
          <Badge variant="default" className="bg-green-600 text-white">
            Context Enhanced
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          The wagmi for Solana. Start with the Overview to understand Arc's architecture, then explore progressive examples from basic operations to advanced custom codecs.
        </p>
      </div>

      {/* Code Examples */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="setup" className="text-xs">Setup</TabsTrigger>
          <TabsTrigger value="wallet" className="text-xs">Wallet</TabsTrigger>
          <TabsTrigger value="balance" className="text-xs">Balance</TabsTrigger>
          <TabsTrigger value="airdrop" className="text-xs">Airdrop</TabsTrigger>
          <TabsTrigger value="cluster" className="text-xs">Network</TabsTrigger>
          <TabsTrigger value="transaction" className="text-xs">Transfer</TabsTrigger>
          <TabsTrigger value="mint" className="text-xs">Level 2</TabsTrigger>
          <TabsTrigger value="level3" className="text-xs">Level 3</TabsTrigger>
          <TabsTrigger value="complete" className="text-xs">Complete</TabsTrigger>
        </TabsList>

        {Object.entries(codeExamples).map(([key, code]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <div className="relative">
              <div className="absolute top-2 right-2 z-10">
                <CopyButton
                  textToCopy={code}
                  displayText="Copy"
                  className="px-3 py-1 text-sm bg-zinc-700 text-white rounded hover:bg-zinc-800 transition-colors shadow-lg"
                  showText={true}
                />
              </div>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  fontSize: '13px',
                  lineHeight: '1.4',
                  height: '100%',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                  }
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}