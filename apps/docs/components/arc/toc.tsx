'use client'

import { AnchorProvider, ScrollProvider, TOCItem } from 'fumadocs-core/toc'
import { type ReactNode } from 'react'
import { type TOCItemType } from 'fumadocs-core/server'
import { cn } from '@/lib/utils'
import { Hash } from 'lucide-react'
import { IconBinocularsFill } from 'symbols-react'

interface ArcTOCProps {
  items: TOCItemType[]
  children?: ReactNode
  className?: string
}

export function ArcTOC({ items, children, className }: ArcTOCProps) {
  if (!items || items.length === 0) return children

  return (
    <AnchorProvider toc={items}>
      <ScrollProvider containerRef={{ current: null }}>
        <div className="flex gap-8 max-w-[1400px] mx-auto">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Table of Contents */}
          <aside className={cn(
            "hidden xl:block w-64 shrink-0",
            className
          )}>
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  <IconBinocularsFill className="h-4 w-4 fill-zinc-500 dark:fill-zinc-400" />
                  <span className="text-zinc-500 dark:text-zinc-400">On this page</span>
                </div>
                
                <nav className="space-y-1">
                  {items.map((item, index) => (
                    <TOCItemComponent 
                      key={`${item.url}-${index}`} 
                      item={item} 
                    />
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </ScrollProvider>
    </AnchorProvider>
  )
}

interface TOCItemComponentProps {
  item: TOCItemType
}

function TOCItemComponent({ item }: TOCItemComponentProps) {
  const depth = item.depth || 2
  const maxDepth = 4

  // Don't show items deeper than maxDepth
  if (depth > maxDepth) return null

  return (
    <TOCItem 
      href={item.url}
      className={cn(
        "block text-sm transition-all duration-150 py-1.5 px-3",
        "border-l-2 border-transparent",
        "data-[active=true]:border-zinc-200 dark:data-[active=true]:border-zinc-800",
        "data-[active=true]:text-zinc-900 dark:data-[active=true]:text-zinc-100",
        "data-[active=true]:font-medium",
        "text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 underline-none decoration-none",
        // Indent based on depth
        depth === 3 && "ml-4",
        depth === 4 && "ml-8",
      )}
    >
      <span 
        className="truncate block underline-none decoration-none border-none font-normal font-sans !text-[13px]"
        style={{ 
          fontSize: depth >= 4 ? '0.8rem' : '0.875rem',
          lineHeight: depth >= 4 ? '1rem' : '1.25rem'
        }}
      >
        {item.title}
      </span>
    </TOCItem>
  )
}

// Simplified TOC for mobile or compact views
export function ArcTOCCompact({ items }: { items: TOCItemType[] }) {
  if (!items || items.length === 0) return null

  return (
    <AnchorProvider toc={items}>
      <ScrollProvider containerRef={{ current: null }}>
        <details className="mb-6 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900">
          <summary className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer">
            <Hash className="h-4 w-4" />
            <span>Table of Contents</span>
          </summary>
          
          <nav className="mt-4 space-y-1">
            {items.slice(0, 8).map((item, index) => ( // Limit to 8 items for compact view
              <TOCItem 
                key={`${item.url}-${index}`}
                href={item.url}
                className={cn(
                  "block text-sm transition-all duration-150 py-1 px-2 underline-none decoration-none",
                  "border-l-2 border-transparent",
                  "data-[active=true]:border-zinc-200 dark:data-[active=true]:border-zinc-800",
                  "data-[active=true]:text-zinc-900 dark:data-[active=true]:text-zinc-100",
                  "text-gray-400 dark:text-gray-300 hover:text-zinc-900 dark:hover:text-zinc-100",
                  // Simple indent
                  (item.depth || 2) > 2 && "ml-4 underline-none decoration-none"
                )}
              >
                {item.title}
              </TOCItem>
            ))}
          </nav>
        </details>
      </ScrollProvider>
    </AnchorProvider>
  )
}
