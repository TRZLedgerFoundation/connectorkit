import React from 'react'
import { useDropdown } from './root'
import type { DropdownItemProps } from './types'

export function DropdownItem({ 
  children, 
  className = '', 
  onClick,
  onSelect,
  disabled = false 
}: DropdownItemProps) {
  const { close } = useDropdown()

  const handleClick = async () => {
    if (!disabled) {
      // Execute onSelect first (preferred), then onClick
      if (onSelect) {
        await onSelect()
      } else if (onClick) {
        onClick()
      }
      close() // Close dropdown after item selection
    }
  }

  const combinedClassName = [
    'connector-dropdown-item',
    'connector-cursor-pointer',
    'connector-transition-colors',
    disabled && 'connector-disabled',
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={combinedClassName}
      onClick={handleClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {children}
    </div>
  )
}
