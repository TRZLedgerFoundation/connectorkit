import type { ReactNode } from 'react'
import { type TOCItemType } from 'fumadocs-core/server'
import { ArcTOC, ArcTOCCompact } from './toc'
import { cn } from '@/lib/utils'

interface ArcDocsPageProps {
  toc?: TOCItemType[]
  children: ReactNode
  full?: boolean
  className?: string
}

export function ArcDocsPage({ toc, children, full = false, className }: ArcDocsPageProps) {
  // If full width or no TOC, render without TOC sidebar
  if (full || !toc || toc.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        {/* Compact TOC for mobile when we have TOC items */}
        {toc && toc.length > 0 && (
          <div className="xl:hidden mb-8">
            <ArcTOCCompact items={toc} />
          </div>
        )}
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    )
  }

  // Render with TOC
  return (
    <ArcTOC items={toc} className={className}>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        {children}
      </div>
    </ArcTOC>
  )
}

interface ArcDocsTitleProps {
  children: ReactNode
  className?: string
}

export function ArcDocsTitle({ children, className }: ArcDocsTitleProps) {
  return (
    <h1 className={cn(
      "text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4",
      "bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent",
      className
    )}>
      {children}
    </h1>
  )
}

interface ArcDocsDescriptionProps {
  children: ReactNode
  className?: string
}

export function ArcDocsDescription({ children, className }: ArcDocsDescriptionProps) {
  return (
    <p className={cn(
      "text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed",
      "border-l-4 border-zinc-200 dark:border-zinc-800 pl-4",
      className
    )}>
      {children}
    </p>
  )
}

interface ArcDocsContentProps {
  children: ReactNode
  className?: string
}

export function ArcDocsContent({ children, className }: ArcDocsContentProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  )
}

// Alternative page component for demo/interactive content
interface ArcDocsInteractivePageProps {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
}

export function ArcDocsInteractivePage({ 
  title, 
  description, 
  children, 
  className 
}: ArcDocsInteractivePageProps) {
  return (
    <div className={cn("w-full space-y-8", className)}>
      {title && (
        <header className="space-y-4">
          {typeof title === 'string' ? (
            <ArcDocsTitle>{title}</ArcDocsTitle>
          ) : (
            title
          )}
          
          {description && (
            typeof description === 'string' ? (
              <ArcDocsDescription>{description}</ArcDocsDescription>
            ) : (
              description
            )
          )}
        </header>
      )}
      
      <div className="space-y-8">
        {children}
      </div>
    </div>
  )
}
