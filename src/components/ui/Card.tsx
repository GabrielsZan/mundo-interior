import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  children:   ReactNode
}

export function Card({ hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`${hoverable ? 'card-hover' : 'card'} p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
