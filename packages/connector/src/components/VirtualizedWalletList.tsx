/**
 * Virtualized Wallet List with React 19 Performance Patterns
 * Efficiently renders large lists of wallets with lazy loading
 */

'use client'

import React, {
  useMemo,
  useState,
  useCallback,
  useDeferredValue,
  startTransition,
  useRef,
  useEffect,
  memo
} from 'react'
import type { SolanaWalletConfig } from '../wallets'

interface VirtualizedWalletListProps {
  wallets: SolanaWalletConfig[]
  onWalletSelect: (walletName: string) => void
  itemHeight?: number
  containerHeight?: number
  overscan?: number
  searchQuery?: string
  filterInstalled?: boolean
  className?: string
  style?: React.CSSProperties
}

interface VirtualizedItemProps {
  wallet: SolanaWalletConfig
  onSelect: (walletName: string) => void
  isVisible: boolean
  style: React.CSSProperties
}

// Individual wallet item with lazy loading
const WalletItem = memo<VirtualizedItemProps>(({ wallet, onSelect, isVisible, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection observer for lazy loading
  useEffect(() => {
    if (!isVisible || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = wallet.icon || ''
          observer.unobserve(imgRef.current)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(imgRef.current)
    
    return () => observer.disconnect()
  }, [isVisible, wallet.icon])

  const handleSelect = useCallback(() => {
    startTransition(() => {
      onSelect(wallet.name)
    })
  }, [wallet.name, onSelect])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
  }, [])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        transition: 'background-color 0.15s ease'
      }}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
    >
      {/* Wallet Icon with Lazy Loading */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          backgroundColor: imageLoaded ? 'transparent' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {!imageError ? (
          <>
            <img
              ref={imgRef}
              alt={`${wallet.name} icon`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.2s ease'
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f3f4f6',
                  fontSize: '12px',
                  color: '#6b7280'
                }}
              >
                {wallet.name.charAt(0).toUpperCase()}
              </div>
            )}
          </>
        ) : (
          // Fallback icon
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}
          >
            {wallet.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Wallet Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {wallet.name}
          
          {/* Popular badge */}
          {wallet.isPopular && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                backgroundColor: '#dbeafe',
                color: '#1d4ed8',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Popular
            </span>
          )}

          {/* Mobile badge */}
          {wallet.isMobile && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '4px',
                fontWeight: '500'
              }}
            >
              Mobile
            </span>
          )}
        </div>
        
        {/* Description removed as it's not in SolanaWalletConfig */}
      </div>

      {/* Status badge - can be extended based on wallet detection */}
      <div
        style={{
          fontSize: '12px',
          color: '#6b7280',
          fontWeight: '500',
          marginLeft: '8px'
        }}
      >
        {wallet.isPopular ? 'Popular' : ''}
      </div>
    </div>
  )
})

WalletItem.displayName = 'WalletItem'

export const VirtualizedWalletList = memo<VirtualizedWalletListProps>(({
  wallets,
  onWalletSelect,
  itemHeight = 64,
  containerHeight = 400,
  overscan = 5,
  searchQuery = '',
  filterInstalled = false,
  className,
  style
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Defer search query for better performance
  const deferredSearchQuery = useDeferredValue(searchQuery)

  // Filter wallets based on search and installation status
  const filteredWallets = useMemo(() => {
    let filtered = wallets

    // Filter by search query
    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase()
      filtered = filtered.filter(wallet => 
        wallet.name.toLowerCase().includes(query) ||
        wallet.shortName?.toLowerCase().includes(query)
      )
    }

    // Filter by installation status (placeholder - would need actual detection)
    if (filterInstalled) {
      // This would require wallet detection logic
      // For now, just show all wallets
      // filtered = filtered.filter(wallet => wallet.installed)
    }

    // Sort: popular first, then alphabetical
    return filtered.sort((a, b) => {
      if (a.isPopular !== b.isPopular) {
        return a.isPopular ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
  }, [wallets, deferredSearchQuery, filterInstalled])

  // Calculate visible items
  const { visibleItems, totalHeight } = useMemo(() => {
    const totalItems = filteredWallets.length
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )
    
    const visibleStartIndex = Math.max(0, startIndex - overscan)
    const visibleEndIndex = Math.min(totalItems - 1, endIndex + overscan)

    const items = []
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
      if (filteredWallets[i]) {
        items.push({
          index: i,
          wallet: filteredWallets[i],
          offsetTop: i * itemHeight
        })
      }
    }

    return {
      visibleItems: items,
      totalHeight: totalItems * itemHeight
    }
  }, [filteredWallets, scrollTop, itemHeight, containerHeight, overscan])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    startTransition(() => {
      setScrollTop(target.scrollTop)
    })
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      // Add keyboard navigation logic here
    }
  }, [])

  if (filteredWallets.length === 0) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: containerHeight,
          color: '#6b7280',
          fontSize: '14px'
        }}
      >
        {deferredSearchQuery ? 'No wallets found matching your search.' : 'No wallets available.'}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
      }}
      onScroll={handleScroll}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="Available wallets"
    >
      {/* Virtual container */}
      <div
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        {visibleItems.map(({ index, wallet, offsetTop }) => (
          <WalletItem
            key={`${wallet.name}-${index}`}
            wallet={wallet}
            onSelect={onWalletSelect}
            isVisible={true} // All items in visible range are considered visible
            style={{
              position: 'absolute',
              top: offsetTop,
              left: 0,
              right: 0,
              height: itemHeight
            }}
          />
        ))}
      </div>
    </div>
  )
})

VirtualizedWalletList.displayName = 'VirtualizedWalletList'

/**
 * React 19 Usage Examples:
 * 
 * ```tsx
 * // Basic usage with search
 * const [searchQuery, setSearchQuery] = useState('')
 * 
 * <VirtualizedWalletList
 *   wallets={allWallets}
 *   searchQuery={searchQuery}
 *   onWalletSelect={(name) => connectWallet(name)}
 *   containerHeight={400}
 *   itemHeight={64}
 * />
 * 
 * // With filtering
 * <VirtualizedWalletList
 *   wallets={allWallets}
 *   filterInstalled={true}
 *   onWalletSelect={handleWalletSelect}
 *   overscan={10} // Render 10 extra items for smoother scrolling
 * />
 * 
 * // Performance monitoring
 * const walletListRef = useRef()
 * 
 * useEffect(() => {
 *   if (process.env.NODE_ENV === 'development') {
 *     console.time('wallet-list-render')
 *     return () => console.timeEnd('wallet-list-render')
 *   }
 * }, [])
 * ```
 */
