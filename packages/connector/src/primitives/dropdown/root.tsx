import React, { useState, useCallback, createContext, useContext } from 'react'
import type { DropdownRootProps } from './types'

interface DropdownContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const DropdownContext = createContext<DropdownContextType | null>(null)

export function useDropdown() {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownRoot')
  }
  return context
}

export function DropdownRoot({ children, open: controlledOpen, onOpenChange }: DropdownRootProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

  const open = useCallback(() => {
    handleOpenChange(true)
  }, [handleOpenChange])

  const close = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  const toggle = useCallback(() => {
    handleOpenChange(!isOpen)
  }, [isOpen, handleOpenChange])

  const value: DropdownContextType = {
    isOpen,
    open,
    close,
    toggle
  }

  return (
    <DropdownContext.Provider value={value}>
      <div className="connector-dropdown-root connector-relative">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}
