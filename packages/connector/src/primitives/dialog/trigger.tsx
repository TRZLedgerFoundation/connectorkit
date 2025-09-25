import React from 'react'
import { useDialog } from './context'
import type { DialogTriggerProps } from './types'

export function DialogTrigger({ children, asChild = false }: DialogTriggerProps) {
  const context = useDialog()
  
  // Safely handle the open action
  const handleOpen = () => {
    if (context && context.open) {
      context.open()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpen()
    }
  }

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleOpen,
      onKeyDown: handleKeyDown,
      role: 'button',
      tabIndex: 0
    })
  }

  return (
    <button 
      onClick={handleOpen} 
      type="button"
      className="connector-button"
    >
      {children}
    </button>
  )
}