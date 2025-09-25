import React from 'react'
import { useDialog } from './context'
import type { DialogCloseProps } from './types'

export function DialogClose({ children, asChild = false }: DialogCloseProps) {
  const context = useDialog()
  
  // Safely handle the close action
  const handleClose = () => {
    if (context && context.close) {
      context.close()
    }
  }

  if (asChild) {
    return (
      <span 
        onClick={handleClose} 
        className="connector-cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClose()
          }
        }}
      >
        {children}
      </span>
    )
  }

  return (
    <button 
      onClick={handleClose} 
      type="button"
      className="connector-modal__close"
      aria-label="Close dialog"
    >
      {children}
    </button>
  )
}
