import type { ReactNode, CSSProperties } from 'react'

export interface DropdownRootProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface DropdownTriggerProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

export interface DropdownContentProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  align?: 'start' | 'center' | 'end'
}

export interface DropdownItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  onSelect?: () => void | Promise<void>
  disabled?: boolean
}
