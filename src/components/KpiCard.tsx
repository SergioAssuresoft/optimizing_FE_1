import type { ReactNode } from 'react'

export default function KpiCard({
  label,
  value,
  helper,
  tone = 'default',
  icon
}: {
  label: string
  value: ReactNode
  helper?: string
  tone?: 'default' | 'danger' | 'success'
  icon?: ReactNode
}) {
  return (
    <div className={`kpi-card kpi-card--${tone}`}>
      <div className="kpi-card__meta">
        {icon}
        <span>{label}</span>
      </div>
      <div className="kpi-card__value">{value}</div>
      {helper ? <small className="kpi-card__helper">{helper}</small> : null}
    </div>
  )
}
