import React from 'react'
import { useDialog } from './context'
import type { DialogContentProps } from './types'

export function DialogContent({ 
  children, 
  className = '', 
  style 
}: DialogContentProps) {
  const context = useDialog()
  
  // Only render if dialog is open or if we don't have context (for SSR safety)
  if (context && !context.isOpen) {
    return null
  }

  const combinedClassName = [
    'connector-modal',
    'connector-animate-scale-in',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={combinedClassName}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {children}
    </div>
  )
}
