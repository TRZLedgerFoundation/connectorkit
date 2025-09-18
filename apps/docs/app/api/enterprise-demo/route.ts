import { createClient } from '@connectorkit/solana/client'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 🌐 ENTERPRISE RPC DEMO: Advanced Production Features
 * 
 * Demonstrates Arc's enterprise RPC management with:
 * - Load balancing across multiple endpoints
 * - Health monitoring and circuit breakers
 * - Performance metrics and monitoring
 * - Automatic failover and regional distribution
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('🌐 [Enterprise Demo] Starting enterprise Arc client...')
    
    // Create client (simple demo of fallback/enterprise concepts would go via transport in future)
    const arc = createClient({ cluster: 'devnet', commitment: 'confirmed' })

    console.log('✅ [Enterprise Demo] Enterprise Arc client created')
    
    // Get a sample address for testing
    const testAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
    
    // Perform multiple operations to demonstrate load balancing
    const operations = await Promise.allSettled([
      arc.getBalance(testAddress),
      arc.getAccountInfo(testAddress),
      arc.getMint('So11111111111111111111111111111111111111112'), // Wrapped SOL
      arc.getTokenBalance('So11111111111111111111111111111111111111112', testAddress),
      // Simulate more load
      arc.getBalance(testAddress),
      arc.getBalance(testAddress),
      arc.getBalance(testAddress)
    ])

    // Enterprise metrics not available in the new minimal client

    const endTime = Date.now()
    const executionTime = endTime - startTime

    // Build comprehensive enterprise response
    const response = {
      // Metadata
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      environment: 'server',
      demoType: 'enterprise',
      
      // Configuration info
      configuration: {
        isEnterprise: false,
        network: 'devnet'
      },
      
      // Operation results
      operations: {
        total: operations.length,
        successful: operations.filter(op => op.status === 'fulfilled').length,
        failed: operations.filter(op => op.status === 'rejected').length,
        results: operations.map((op, index) => ({
          operation: ['getBalance', 'getAccountInfo', 'getMint', 'getTokenBalance', 'getBalance#2', 'getBalance#3', 'getBalance#4'][index],
          status: op.status,
          ...(op.status === 'fulfilled' ? { data: op.value } : { error: op.reason?.message })
        }))
      },
      
      // Enterprise metrics
      enterpriseMetrics: null,
      
      // Performance insights
      insights: {
         loadBalancingActive: false,
         healthMonitoringActive: false,
         circuitBreakersActive: false,
         averageGlobalResponseTime: null,
         globalSuccessRate: null,
         recommendedActions: []
      }
    }

    console.log('🎯 [Enterprise Demo] Operations completed:', response.operations.successful, 'successful')

    // Convert BigInt values to strings for JSON serialization
    const jsonResponse = JSON.stringify(response, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )

    return new NextResponse(jsonResponse, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Arc-Enterprise': 'false',
        'X-Arc-Execution-Time': `${executionTime}ms`
      }
    })

  } catch (error) {
    console.error('❌ [Enterprise Demo] Error:', error)
    
    const endTime = Date.now()
    const executionTime = endTime - startTime
    
    return NextResponse.json({
      error: 'Enterprise demo failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      executionTime: `${executionTime}ms`,
      environment: 'server'
    }, { 
      status: 500,
      headers: {
        'X-Arc-Enterprise': 'error',
        'X-Arc-Execution-Time': `${executionTime}ms`
      }
    })
  }
}

/**
 * POST endpoint to test enterprise RPC under load
 */
export async function POST(request: NextRequest) {
  try {
    const { operations = 10, delay = 100 } = await request.json()
    
    console.log(`🔥 [Enterprise Load Test] Starting ${operations} operations with ${delay}ms delay`)
    
    const arc = createClient({ cluster: 'devnet', commitment: 'confirmed' })

    const testAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
    const startTime = Date.now()
    
    // Create array of operations
    const promises = Array.from({ length: operations }, async (_, i) => {
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, i * delay))
      }
      return arc.getBalance(testAddress)
    })

    // Execute all operations
    const results = await Promise.allSettled(promises)
    const endTime = Date.now()
    
    return NextResponse.json({
      loadTest: {
        operations,
        delay,
        totalTime: `${endTime - startTime}ms`,
        successful: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        successRate: `${(results.filter(r => r.status === 'fulfilled').length / operations * 100).toFixed(1)}%`
      },
      metrics: null
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Load test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}