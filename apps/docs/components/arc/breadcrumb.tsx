'use client'

import { usePathname } from 'next/navigation'
import { useBreadcrumb } from 'fumadocs-core/breadcrumb'
import { type PageTree } from 'fumadocs-core/server'
import { Fragment } from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { IconHouseFill } from 'symbols-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ArcBreadcrumbProps {
  tree: PageTree.Root
}

export function ArcBreadcrumb({ tree }: ArcBreadcrumbProps) {
  const pathname = usePathname()
  const items = useBreadcrumb(pathname, tree)

  if (items.length === 0) return null

  return (
    <nav className="flex items-center gap-2 text-sm font-medium mb-8 py-4">
      {/* Home link */}
      <Link
        href="/docs"
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md transition-colors duration-150",
          "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
          "hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
      >
        <IconHouseFill className="h-4 w-4 fill-zinc-500 dark:fill-zinc-400" />
        <span className="sr-only">Home</span>
      </Link>

      {/* Breadcrumb items */}
      {items.map((item, i) => (
        <Fragment key={i}>
          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 shrink-0" />
          
          {item.url ? (
            <Link
              href={item.url}
              className={cn(
                "px-2 py-1 rounded-md transition-colors duration-150 truncate max-w-[200px]",
                "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                // Last item (current page) styling
                i === items.length - 1 && [
                  "text-gray-900 dark:text-gray-100 font-semibold",
                  "bg-gray-100 dark:bg-gray-800"
                ]
              )}
            >
              {item.name}
            </Link>
          ) : (
            <span className={cn(
              "px-2 py-1 rounded-md truncate max-w-[200px]",
              "text-gray-900 dark:text-gray-100 font-semibold",
              "bg-gray-100 dark:bg-gray-800"
            )}>
              {item.name}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
