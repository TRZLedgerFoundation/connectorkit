import type { ReactNode } from 'react'
import { type PageTree } from 'fumadocs-core/server'
import { ArcSidebar } from './sidebar'
import { ArcBreadcrumb } from './breadcrumb'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import logoArc from '@/app/(home)/assets/logo-arc.png'

interface ArcDocsLayoutProps {
  tree: PageTree.Root
  children: ReactNode
  className?: string
}

export function ArcDocsLayout({ tree, children, className }: ArcDocsLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 hidden">
            {/* Logo */}
            <Link href="/docs" className="flex items-center gap-3">
              <Image
                src={logoArc}
                alt="Arc Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div className="hidden sm:block">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">ARC</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 translate-y-[-2px] px-2 py-0.5 border border-gray-300 dark:border-gray-700 rounded font-mono">
                    0.1.0
                  </div>
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/docs" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Documentation
              </Link>
              <Link 
                href="/docs/connector-kit/introduction" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Connector Kit
              </Link>
              <a 
                href="https://github.com/your-org/arc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <ArcSidebar tree={tree} />

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-w-0",
          "md:ml-80", // Offset for sidebar width
        )}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <ArcBreadcrumb tree={tree} />
            
            {/* Page Content */}
            <div className={cn("prose prose-gray dark:prose-invert max-w-none", className)}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Alternative layout for pages that need custom TOC placement
interface ArcDocsLayoutWithTOCProps extends ArcDocsLayoutProps {
  toc?: ReactNode
}

export function ArcDocsLayoutWithTOC({ tree, children, toc, className }: ArcDocsLayoutWithTOCProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
        <div className="max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/docs" className="flex items-center gap-3">
              <Image
                src={logoArc}
                alt="Arc Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div className="hidden sm:block">
                <div className="flex items-end gap-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">ARC</span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 translate-y-[-2px] px-2 py-0.5 border border-gray-300 dark:border-gray-700 rounded font-mono">
                    0.1.0
                  </div>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/docs" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Documentation
              </Link>
              <Link 
                href="/docs/connector-kit/introduction" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Connector Kit
              </Link>
              <a 
                href="https://github.com/your-org/arc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        <ArcSidebar tree={tree} />

        <main className="flex-1 min-w-0 md:ml-80">
          <div className="flex max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <ArcBreadcrumb tree={tree} />
              
              <div className={cn("prose prose-gray dark:prose-invert max-w-none", className)}>
                {children}
              </div>
            </div>

            {/* TOC */}
            {toc && (
              <aside className="hidden xl:block w-64 shrink-0 ml-8">
                {toc}
              </aside>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
