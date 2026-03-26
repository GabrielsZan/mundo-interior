import { DOMAIN_LABELS } from '@/types'
import type { Domain } from '@/types'

interface DomainBadgeProps {
  domain: Domain
}

const badgeClass: Record<Domain, string> = {
  mind:     'domain-badge-mind',
  body:     'domain-badge-body',
  soul:     'domain-badge-soul',
  creation: 'domain-badge-creation',
}

export function DomainBadge({ domain }: DomainBadgeProps) {
  return (
    <span className={badgeClass[domain]}>
      {DOMAIN_LABELS[domain]}
    </span>
  )
}
