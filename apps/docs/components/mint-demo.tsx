'use client'

import { useState } from 'react'
import { useMint } from '@connectorkit/solana'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Spinner } from './ui/spinner'
import { motion } from 'motion/react'
import { Coins, Search, Info, Users, Lock } from 'lucide-react'

/**
 * 🎉 Demo: Arc Level 2 - Typed Program Account Magic
 * 
 * Shows useMint() hook fetching and deserializing mint account data
 * using Kit's fetchMint codec for proper TypeScript typing.
 */
export function MintDemo() {
  const [mintAddress, setMintAddress] = useState('So11111111111111111111111111111111111111112') // Wrapped SOL
  const [isSubmitted, setIsSubmitted] = useState(false)

  // 🔥 THE MAGIC: useMint() returns properly typed mint data!
  const { mint, isLoading, error, refetch } = useMint({ 
    mintAddress: isSubmitted ? mintAddress : undefined,
    enabled: isSubmitted && !!mintAddress 
  })

  const handleSearch = () => {
    setIsSubmitted(true)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setMintAddress('So11111111111111111111111111111111111111112')
  }

  const formatSupply = (supply: bigint, decimals: number) => {
    const divisor = BigInt(10 ** decimals)
    const major = supply / divisor
    const minor = supply % divisor
    return `${major.toLocaleString()}${minor > 0 ? `.${minor.toString().padStart(decimals, '0').replace(/0+$/, '')}` : ''}`
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-6)}`

  // Predefined mint examples
  const examples = [
    { name: 'Wrapped SOL', address: 'So11111111111111111111111111111111111111112' },
    { name: 'USDC', address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    { name: 'USDT', address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' },
  ]

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
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">Typed Program Accounts</h3>
                  <p className="text-sm text-gray-500">Arc Level 2: Kit codec magic in action</p>
                </div>
              </div>
              
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="secondary">Kit fetchMint()</Badge>
                <Badge variant="secondary">TypeScript Types</Badge>
                <Badge variant="secondary">Context Auto-coordination</Badge>
              </div>
            </div>

            {/* Input Section */}
            <div className="w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mint Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mintAddress}
                    onChange={(e) => setMintAddress(e.target.value)}
                    placeholder="Enter mint address..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm font-mono"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!mintAddress || isLoading}
                    className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 text-white border-0"
                  >
                    {isLoading ? (
                      <Spinner size={16} />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {isLoading ? 'Fetching...' : 'Fetch Mint'}
                  </Button>
                </div>
              </div>

              {/* Examples */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {examples.map((example) => (
                    <button
                      key={example.address}
                      onClick={() => setMintAddress(example.address)}
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
                  <p className="font-medium text-gray-700">Fetching mint data...</p>
                  <p className="text-sm text-gray-500">Using Kit's fetchMint() codec</p>
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
                    <div className="font-medium">Failed to fetch mint data</div>
                    <div className="text-sm">{error.message}</div>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {mint && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Success Alert */}
                <Alert className="border-gray-200 bg-gray-50">
                  <Info className="w-4 h-4 text-gray-600" />
                  <AlertDescription className="text-gray-800">
                    <strong>Success!</strong> Mint account data fetched and deserialized using Kit's fetchMint() codec.
                  </AlertDescription>
                </Alert>

                {/* Mint Data Display */}
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="p-4 bg-gray-900 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Coins className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Mint Account Data</h4>
                          <p className="text-sm opacity-90">Typed & deserialized by Kit codec</p>
                        </div>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        ✨ Level 2
                      </Badge>
                    </div>
                  </div>

                  {/* Data Grid */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Supply */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">Total Supply</p>
                          <p className="text-xs text-gray-500 mb-2">Raw: {mint.supply.toString()} units</p>
                          <p className="font-mono text-lg font-semibold text-gray-700">
                            {formatSupply(mint.supply, mint.decimals)} tokens
                          </p>
                        </div>
                      </div>

                      {/* Decimals */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Info className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">Decimals</p>
                          <p className="text-xs text-gray-500 mb-2">Precision places</p>
                          <p className="font-mono text-2xl font-bold text-gray-700">
                            {mint.decimals}
                          </p>
                        </div>
                      </div>

                      {/* Mint Authority */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">Mint Authority</p>
                          <p className="text-xs text-gray-500 mb-2">Can mint new tokens</p>
                          {mint.mintAuthority.__option === 'None' ? (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              🔒 Disabled (Fixed Supply)
                            </Badge>
                          ) : (
                            <p className="font-mono text-xs text-gray-700 break-all bg-white p-2 rounded border">
                              {formatAddress(mint.mintAuthority.value)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Freeze Authority */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">Freeze Authority</p>
                          <p className="text-xs text-gray-500 mb-2">Can freeze accounts</p>
                          {mint.freezeAuthority.__option === 'None' ? (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              🔒 Disabled
                            </Badge>
                          ) : (
                            <p className="font-mono text-xs text-gray-700 break-all bg-white p-2 rounded border">
                              {formatAddress(mint.freezeAuthority.value)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        ✨ Data fetched with Kit's <code className="bg-gray-200 px-1 rounded">fetchMint()</code> codec
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={refetch}>
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
      {mint && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-900 rounded-xl text-white text-sm font-mono shadow-lg text-left"
        >
          <div className="text-green-400 mb-2">// 🔥 The Arc Way - Level 2: Typed Program Accounts</div>
          <div className="text-gray-300">
            <div className="text-blue-400">const</div> {`{ mint, isLoading } = `}<div className="text-yellow-400">useMint</div>({`{`}
          </div>
          <div className="text-gray-300 ml-4">
            mintAddress: <div className="text-green-300">'{formatAddress(mintAddress)}'</div>
          </div>
          <div className="text-gray-300">{`})`}</div>
          <div className="mt-2 text-gray-400">
            <div className="text-gray-500">// ✨ Returns properly typed data:</div>
            <div>mint.supply: <div className="text-yellow-300">{mint.supply.toString()}</div></div>
            <div>mint.decimals: <div className="text-yellow-300">{mint.decimals}</div></div>
            <div>mint.mintAuthority: <div className="text-yellow-300">"{mint.mintAuthority.__option}"</div></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}