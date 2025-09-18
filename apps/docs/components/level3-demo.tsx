'use client'

import { useState } from 'react'
import { 
  useProgramAccount,
  type MintAccount,
  type CustomCodec
} from '@connectorkit/solana'
import { type Address, createSolanaRpc } from '@solana/kit'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Spinner } from './ui/spinner'
import { motion } from 'motion/react'
import { Zap, Search, Info, Coins, Lock } from 'lucide-react'

/**
 * 🚀 Demo: Arc Level 3 - Generic Program Account Magic
 * 
 * Shows useProgramAccount<T>() hook with built-in codecs AND custom codec support
 * for ultimate flexibility parsing ANY program account with proper TypeScript typing.
 */
export function Level3Demo() {
  const [accountAddress, setAccountAddress] = useState('So11111111111111111111111111111111111111112') // Wrapped SOL
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [useCustomCodec, setUseCustomCodec] = useState(false)

  // Custom codec example - simulates parsing any account
  const customAccountCodec: CustomCodec<any> = async (rpc: ReturnType<typeof createSolanaRpc>, address: Address) => {
    const response = await rpc.getAccountInfo(address).send()
    
    if (!response?.value) {
      throw new Error('Account not found')
    }

    // Simulate parsing - in real use you'd parse based on the program
    // This demonstrates the flexibility of custom codecs
    return {
      accountType: 'Custom Parsed Account',
      address: address,
      slot: response.context.slot,
      hasData: !!response.value,
      customFields: {
        parsedBy: 'Custom Codec',
        timestamp: new Date().toISOString(),
        note: 'This demonstrates custom codec flexibility - parse ANY account type'
      }
    }
  }

  // Built-in mint codec
  const { data: mintData, isLoading: mintLoading, error: mintError } = useProgramAccount<MintAccount>({
    address: isSubmitted && !useCustomCodec ? accountAddress : undefined,
    program: 'mint',
    enabled: isSubmitted && !useCustomCodec && !!accountAddress
  })

  // Custom codec
  const { data: customData, isLoading: customLoading, error: customError } = useProgramAccount({
    address: isSubmitted && useCustomCodec ? accountAddress : undefined,
    codec: customAccountCodec,
    enabled: isSubmitted && useCustomCodec && !!accountAddress
  })

  const handleSearch = () => {
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setAccountAddress('So11111111111111111111111111111111111111112')
    setUseCustomCodec(false)
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`
  const formatSupply = (supply: bigint, decimals: number) => {
    const divisor = BigInt(10 ** decimals)
    const major = supply / divisor
    return `${major.toLocaleString()}`
  }

  // Predefined examples
  const examples = [
    { name: 'Wrapped SOL', address: 'So11111111111111111111111111111111111111112', type: 'mint' },
    { name: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', type: 'mint' },
    { name: 'Any Account', address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', type: 'custom' },
  ]

  const isLoading = mintLoading || customLoading
  const error = mintError || customError
  const data = mintData || customData

  return (
    <div className="space-y-6">
      {/* Main Container */}
      <div className="flex flex-col items-center justify-center w-full min-h-[400px] rounded-3xl bg-white gap-6 p-6">
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 w-full max-w-md"
          >
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">Generic Program Accounts</h3>
                  <p className="text-sm text-gray-500">Arc Level 3: Ultimate developer flexibility</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="secondary">useProgramAccount&lt;T&gt;()</Badge>
                <Badge variant="secondary">Built-in + Custom Codecs</Badge>
                <Badge variant="secondary">TypeScript Generics</Badge>
              </div>
            </div>

            {/* Input Section */}
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={accountAddress}
                    onChange={(e) => setAccountAddress(e.target.value)}
                    placeholder="Enter account address..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm font-mono"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!accountAddress || isLoading}
                    className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white"
                  >
                    {isLoading ? (
                      <Spinner size={16} />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isLoading ? 'Parsing...' : 'Parse Account'}
                  </Button>
                </div>
              </div>

              {/* Codec Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parsing Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseCustomCodec(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !useCustomCodec
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🪙 Built-in Mint Codec
                  </button>
                  <button
                    onClick={() => setUseCustomCodec(true)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      useCustomCodec
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔧 Custom Codec
                  </button>
                </div>
              </div>

              {/* Examples */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example.address}
                      onClick={() => {
                        setAccountAddress(example.address)
                        setUseCustomCodec(example.type === 'custom')
                      }}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors border border-gray-200 hover:border-gray-300"
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl">
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <Spinner size={32} />
                <div className="text-center">
                  <p className="font-medium text-gray-700">
                    {useCustomCodec ? 'Parsing with custom codec...' : 'Fetching mint data...'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Using useProgramAccount&lt;T&gt;() with {useCustomCodec ? 'custom codec' : 'built-in mint codec'}
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="space-y-2">
                    <div className="font-medium">Failed to parse account data</div>
                    <div className="text-sm">{error.message}</div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {data && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Success Alert */}
                <Alert className="border-gray-200 bg-gray-50">
                  <Info className="w-4 h-4 text-gray-600" />
                  <AlertDescription className="text-gray-800">
                    <strong>Success!</strong> Account data parsed using {useCustomCodec ? 'custom codec' : 'built-in mint codec'}.
                  </AlertDescription>
                </Alert>

                {/* Account Data Display */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="p-4 bg-gray-900 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          {useCustomCodec ? <Zap className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {useCustomCodec ? 'Custom Parsed Account' : 'Mint Account Data'}
                          </h4>
                          <p className="text-sm opacity-90">
                            Parsed with {useCustomCodec ? 'custom codec' : 'built-in mint codec'}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        ✨ Level 3
                      </Badge>
                    </div>
                  </div>

                  {/* Data Display */}
                  <div className="p-6 space-y-4">
                    {!useCustomCodec && mintData ? (
                      // Mint data display
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Coins className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">Total Supply</p>
                            <p className="text-xs text-gray-500 mb-2">Raw: {mintData.supply.toString()} units</p>
                            <p className="font-mono text-lg font-semibold text-gray-700">
                              {formatSupply(mintData.supply, mintData.decimals)} tokens
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Info className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Decimals</p>
                            <p className="text-xs text-gray-500 mb-2">Precision places</p>
                            <p className="font-mono text-2xl font-bold text-gray-700">
                              {mintData.decimals}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">Mint Authority</p>
                            <p className="text-xs text-gray-500 mb-2">Can mint new tokens</p>
                            {mintData.mintAuthority.__option === 'None' ? (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                🔒 Disabled (Fixed Supply)
                              </Badge>
                            ) : (
                              <p className="font-mono text-xs text-gray-700 break-all bg-white p-2 rounded border">
                                {formatAddress(mintData.mintAuthority.value)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">Freeze Authority</p>
                            <p className="text-xs text-gray-500 mb-2">Can freeze accounts</p>
                            {mintData.freezeAuthority.__option === 'None' ? (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                🔒 Disabled
                              </Badge>
                            ) : (
                              <p className="font-mono text-xs text-gray-700 break-all bg-white p-2 rounded border">
                                {formatAddress(mintData.freezeAuthority.value)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : customData ? (
                      // Custom data display
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Info className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-1">Account Type</p>
                              <p className="text-xs text-gray-500 mb-2">Parsed by custom codec</p>
                              <p className="font-mono text-sm text-gray-700">
                                {customData.accountType}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Coins className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-1">Account Address</p>
                              <p className="text-xs text-gray-500 mb-2">Parsed account</p>
                              <p className="font-mono text-xs text-gray-700 break-all bg-white p-2 rounded border">
                                {customData.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Lock className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Slot</p>
                              <p className="text-xs text-gray-500 mb-2">Current slot</p>
                              <p className="font-mono text-lg font-semibold text-gray-700">
                                {customData.slot.toString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <Info className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 mb-1">Has Data</p>
                              <p className="text-xs text-gray-500 mb-2">Account exists</p>
                              <p className="font-mono text-sm text-gray-700">
                                {customData.hasData ? '✅ Yes' : '❌ No'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-sm font-medium text-gray-900 mb-3">Custom Fields</p>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-medium text-gray-600">Parsed by:</span> <span className="text-gray-700">{customData.customFields.parsedBy}</span></div>
                            <div><span className="font-medium text-gray-600">Timestamp:</span> <span className="text-gray-700 font-mono text-xs">{customData.customFields.timestamp}</span></div>
                            <div><span className="font-medium text-gray-600">Note:</span> <span className="text-gray-700">{customData.customFields.note}</span></div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        ✨ Parsed with <code className="bg-gray-200 px-1 rounded">useProgramAccount&lt;T&gt;()</code> 
                        {useCustomCodec ? ' + custom codec' : ' + built-in mint codec'}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSearch}>
                          Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          New Search
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Code Example */}
      {data && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-900 rounded-xl text-white text-sm font-mono shadow-lg text-left"
        >
          <div className="text-green-400 mb-2">// 🚀 The Arc Way - Level 3: Generic Program Accounts</div>
          <div className="text-gray-300">
            <div className="text-blue-400">const</div> {`{ data, isLoading } = `}<div className="text-yellow-400">useProgramAccount</div>
            {useCustomCodec ? '<CustomType>' : '<MintAccount>'}({`{`}
          </div>
          <div className="text-gray-300 ml-4">
            address: <div className="text-green-300">'{formatAddress(accountAddress)}'</div>,
          </div>
          <div className="text-gray-300 ml-4">
            {useCustomCodec ? (
              <>codec: <div className="text-blue-300">customCodec</div></>
            ) : (
              <>program: <div className="text-green-300">'mint'</div></>
            )}
          </div>
          <div className="text-gray-300">{`})`}</div>
          <div className="mt-2 text-gray-400">
            <div className="text-gray-500">// ✨ Returns properly typed data with full flexibility</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}