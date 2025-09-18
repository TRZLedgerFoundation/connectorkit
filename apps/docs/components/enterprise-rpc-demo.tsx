'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Spinner } from './ui/spinner'
import { Activity, Globe, Shield, Zap, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react'

/**
 * 🌐 Enterprise RPC Demo Component
 * 
 * Showcases Arc's advanced RPC management features:
 * - Load balancing visualization
 * - Health monitoring
 * - Performance metrics
 * - Circuit breaker status
 * - Regional failover
 */
export function EnterpriseRpcDemo() {
  const [demoData, setDemoData] = useState<any>(null)
  const [loadTestData, setLoadTestData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadTesting, setIsLoadTesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Auto-refresh demo data every 30 seconds
  useEffect(() => {
    fetchDemoData()
    const interval = setInterval(fetchDemoData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchDemoData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/enterprise-demo')
      if (!response.ok) throw new Error('Failed to fetch enterprise demo data')
      
      const data = await response.json()
      setDemoData(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const runLoadTest = async () => {
    try {
      setIsLoadTesting(true)
      setError(null)
      
      const response = await fetch('/api/enterprise-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations: 20, delay: 50 })
      })
      
      if (!response.ok) throw new Error('Load test failed')
      
      const data = await response.json()
      setLoadTestData(data)
      
      // Refresh main demo data after load test
      setTimeout(fetchDemoData, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load test failed')
    } finally {
      setIsLoadTesting(false)
    }
  }

  if (error && !demoData) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px] rounded-3xl bg-white gap-6 p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Enterprise RPC Demo</h3>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDemoData} disabled={isLoading}>
            {isLoading ? <Spinner size={16} /> : 'Retry'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Enterprise RPC Management</h3>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Arc's production-grade RPC management with load balancing, health monitoring, 
          circuit breakers, and automatic failover across multiple endpoints.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={fetchDemoData} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Spinner size={16} /> : <Activity className="h-4 w-4" />}
          Refresh Metrics
        </Button>
        
        <Button 
          onClick={runLoadTest}
          disabled={isLoadTesting}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isLoadTesting ? <Spinner size={16} /> : <Zap className="h-4 w-4" />}
          {isLoadTesting ? 'Running Load Test...' : 'Run Load Test'}
        </Button>
      </div>

      {/* Demo Content */}
      <AnimatePresence mode="wait">
        {demoData ? (
          <motion.div
            key="demo-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 space-y-8"
          >
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {demoData.enterpriseMetrics.endpoints.length}
                </div>
                <div className="text-sm text-gray-600">Active Endpoints</div>
              </div>
              
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {demoData.insights.globalSuccessRate}
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              
              <div className="text-center">
                <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {demoData.insights.averageGlobalResponseTime}
                </div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
            </div>

            {/* Endpoints Health */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Endpoint Health & Load Distribution
              </h4>
              
              <div className="space-y-3">
                {demoData.enterpriseMetrics.endpoints.map((endpoint: any, index: number) => (
                  <div key={endpoint.url} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${endpoint.isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="font-medium text-gray-800">
                          {endpoint.url.replace('https://', '')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {endpoint.region} • {endpoint.totalRequests} requests
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={endpoint.isHealthy ? "default" : "destructive"}>
                        {endpoint.successRate}
                      </Badge>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-800">
                          {endpoint.averageResponseTime}
                        </div>
                        <div className="text-xs text-gray-600">response time</div>
                      </div>
                      
                      {endpoint.circuitBreakerOpen && (
                        <Badge variant="destructive">Circuit Open</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 mb-2">Load Balancing</div>
                  <Badge>{demoData.configuration.enterpriseConfig?.loadBalancing || 'weighted'}</Badge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-800 mb-2">Features</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Health Monitoring</Badge>
                    <Badge variant="outline">Circuit Breakers</Badge>
                    <Badge variant="outline">Metrics</Badge>
                    <Badge variant="outline">Regional Failover</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Load Test Results */}
            {loadTestData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t pt-6"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Latest Load Test Results
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 mb-1">Operations</div>
                    <div className="text-xl font-bold text-blue-800">
                      {loadTestData.loadTest.operations}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 mb-1">Success Rate</div>
                    <div className="text-xl font-bold text-green-800">
                      {loadTestData.loadTest.successRate}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 mb-1">Total Time</div>
                    <div className="text-xl font-bold text-purple-800">
                      {loadTestData.loadTest.totalTime}
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 mb-1">Avg Response</div>
                    <div className="text-xl font-bold text-orange-800">
                      {loadTestData.metrics.averageResponseTime}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Insights & Recommendations */}
            {demoData.insights.recommendedActions.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h4>
                <div className="space-y-2">
                  {demoData.insights.recommendedActions.map((action: string, index: number) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{action}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t">
              {lastUpdated && (
                <>Last updated: {lastUpdated.toLocaleTimeString()}</>
              )}
              <br />
              Execution time: {demoData.executionTime} • Environment: {demoData.environment}
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center min-h-[300px]">
            <Spinner size={32} />
          </div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && demoData && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}