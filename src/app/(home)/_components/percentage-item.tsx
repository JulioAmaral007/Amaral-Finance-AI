import type { ReactNode } from 'react'

interface PercentageItemProps {
  icon: ReactNode
  title: string
  value: number
}

export default function PercentageItem({ icon, title, value }: PercentageItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white/5 p-2 text-white backdrop-blur supports-[backdrop-filter]:bg-white/10">
          {icon}
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>
      <p className="text-sm font-semibold tracking-tight">{value}%</p>
    </div>
  )
}
