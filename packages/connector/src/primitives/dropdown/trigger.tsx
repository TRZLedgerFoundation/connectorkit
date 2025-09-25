import React from 'react'
import { useDropdown } from './root'
import type { DropdownTriggerProps } from './types'

export function DropdownTrigger({ children, className = '', asChild = false }: DropdownTriggerProps) {
  const { toggle } = useDropdown()

  const combinedClassName = [
    'connector-dropdown-trigger',
    'connector-cursor-pointer',
    className
  ].filter(Boolean).join(' ')

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  if (asChild) {
    // Clone the child element and add our props
    return React.cloneElement(children as React.ReactElement, {
      onClick: toggle,
      onKeyDown: handleKeyDown,
      className: `${(children as React.ReactElement).props.className || ''} ${combinedClassName}`.trim()
    })
  }

  return (
    <div 
      className={combinedClassName}
      onClick={toggle}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
