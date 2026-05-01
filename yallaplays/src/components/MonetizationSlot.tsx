interface MonetizationSlotProps {
  placement: string
  size?: 'leaderboard' | 'inline' | 'square'
  className?: string
}

export default function MonetizationSlot({ placement, size = 'inline', className = '' }: MonetizationSlotProps) {
  return (
    <div
      className={`monetization-slot rounded-xl ${className}`}
      data-placement={placement}
      data-size={size}
      aria-hidden="true"
    >
      <div className="monetization-slot__surface" />
    </div>
  )
}
