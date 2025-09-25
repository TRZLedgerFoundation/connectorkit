import React from 'react'
import { useDialog } from './context'
import type { DialogBackdropProps } from './types'

export function DialogBackdrop({ 
  className = '', 
  style, 
  onClick 
}: DialogBackdropProps) {
  const context = useDialog()

  // Only render when dialog is open
  if (!context?.isOpen) {
    return null
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (context && context.close) {
      context.close()
    }
  }

  const combinedClassName = [
    'connector-modal-backdrop',
    'connector-animate-fade-in',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={combinedClassName}
      style={style}
      onClick={handleClick}
      aria-hidden="true"
    />
  )
}
