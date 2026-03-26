interface XPBarProps {
  current:  number
  needed:   number
  percent:  number
  color?:   string  // Tailwind bg class, e.g. 'bg-gold'
}

export function XPBar({ current, needed, percent, color = 'bg-gold' }: XPBarProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="progress-bar">
        <div
          className={`progress-fill ${color}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={needed}
        />
      </div>
      <div className="flex justify-between text-xs font-mono text-ink/50">
        <span>{current} XP</span>
        <span>{needed} XP</span>
      </div>
    </div>
  )
}
