import React, { useEffect, useRef } from 'react'
import { useDropdown } from './root'
import type { DropdownContentProps } from './types'

export function DropdownContent({ 
  children, 
  className = '', 
  style,
  align = 'start'
}: DropdownContentProps) {
  const { isOpen, close } = useDropdown()
  const contentRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        close()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, close])

  if (!isOpen) {
    return null
  }

  const alignClass = align === 'end' ? 'connector-dropdown-content--right' : 
                    align === 'center' ? 'connector-dropdown-content--center' : ''

  const combinedClassName = [
    'connector-dropdown-content',
    'connector-absolute',
    'connector-z-50',
    'connector-animate-fade-in',
    alignClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      ref={contentRef}
      className={combinedClassName}
      style={style}
      role="menu"
    >
      {children}
    </div>
  )
}
