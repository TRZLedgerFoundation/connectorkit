import { createClient } from '@connectorkit/solana/client'
import { NextRequest } from 'next/server'

/**
 * 🚀 REAL SERVER-SIDE API: Arc Client Demo
 * 
 * This is an actual Next.js API route running on the server.
 * It uses createClient() without any React dependencies.
 * Perfect for serverless functions, background jobs, etc.
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const startTime = Date.now()
  
  try {
    console.log('🚀 [Server API] Starting Arc client operations...')
    
    // Next.js 15: await params before using
    const { address } = await params
    
    // Create client - this runs on the SERVER, not in the browser
    const arc = createClient({ 
      cluster: 'devnet',
      commitment: 'confirmed'
    })

    console.log('✅ [Server API] client created')
    console.log('🔍 [Server API] Fetching data for:', address)

    // Run multiple operations in parallel (server-side optimization)
    const [balanceResult, mintResult, tokenAccountResult, tokenBalanceResult] = await Promise.allSettled([
      arc.getBalance(address),
      arc.getMint('So11111111111111111111111111111111111111112'), // Wrapped SOL
      arc.getTokenAccount('So11111111111111111111111111111111111111112', address), // WSOL token account
      arc.getTokenBalance('So11111111111111111111111111111111111111112', address)  // WSOL balance
    ])

    const endTime = Date.now()
    const executionTime = endTime - startTime

    // Build response with detailed server info
    const response = {
      // Metadata
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      environment: 'server',
      serverInfo: {
        network: 'Devnet',
        rpcUrl: 'https://api.devnet.solana.com',
        isDevnet: true,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform
      },

      // Target wallet
      targetAddress: address,
      
      // Operations results
      operations: {
        balance: balanceResult.status === 'fulfilled' ? {
          success: true,
          value: Number(balanceResult.value),
          solValue: Number(balanceResult.value) / 1e9,
          lamports: balanceResult.value.toString()
        } : {
          success: false,
          error: balanceResult.status === 'rejected' ? balanceResult.reason?.message : 'Unknown error'
        },
        
        mint: mintResult.status === 'fulfilled' ? {
          success: true,
          supply: Number(mintResult.value.supply),
          decimals: mintResult.value.decimals,
          mintAuthority: mintResult.value.mintAuthority.__option,
          freezeAuthority: mintResult.value.freezeAuthority.__option,
          isNative: mintResult.value.isInitialized
        } : {
          success: false,
          error: mintResult.status === 'rejected' ? mintResult.reason?.message : 'Unknown error'
        },

        tokenAccount: tokenAccountResult.status === 'fulfilled' ? {
          success: true,
          data: tokenAccountResult.value ? {
            address: tokenAccountResult.value.address,
            amount: tokenAccountResult.value.amount.toString(),
            decimals: tokenAccountResult.value.decimals,
            uiAmount: tokenAccountResult.value.uiAmount,
            state: tokenAccountResult.value.state,
            isNative: tokenAccountResult.value.isNative
          } : null
        } : {
          success: false,
          error: tokenAccountResult.status === 'rejected' ? tokenAccountResult.reason?.message : 'Unknown error'
        },

        tokenBalance: tokenBalanceResult.status === 'fulfilled' ? {
          success: true,
          data: tokenBalanceResult.value ? {
            amount: tokenBalanceResult.value.amount.toString(),
            decimals: tokenBalanceResult.value.decimals,
            uiAmount: tokenBalanceResult.value.uiAmount,
            uiAmountString: tokenBalanceResult.value.uiAmountString,
            tokenAccount: tokenBalanceResult.value.tokenAccount
          } : null
        } : {
          success: false,
          error: tokenBalanceResult.status === 'rejected' ? tokenBalanceResult.reason?.message : 'Unknown error'
        }
      }
    }

    console.log('✅ [Server API] Operations completed in', executionTime, 'ms')
    
    // Return JSON response with CORS headers
    return Response.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error: any) {
    console.error('❌ [Server API] Error:', error)
    
    // For error case, try to get address, but handle if params fails too
    let targetAddress: string
    try {
      const { address } = await params
      targetAddress = address
    } catch {
      targetAddress = 'unknown'
    }
    
    return Response.json(
      { 
        error: error.message,
        timestamp: new Date().toISOString(),
        environment: 'server',
        targetAddress
      }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}