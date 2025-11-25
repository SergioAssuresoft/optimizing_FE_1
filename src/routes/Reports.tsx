import { useState } from 'react'
import ReportTable from '../components/ReportTable'
import KpiCard from '../components/KpiCard'
import { ordersDataset } from '../utils/datasets'
import { slowCompute } from '../utils/slow'

const regions = ['Todos', 'Norte', 'Sur', 'Este', 'Oeste'] as const
const months = ['Todos', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'] as const

type Region = (typeof regions)[number]
type Month = (typeof months)[number]

export default function Reports() {
  const [region, setRegion] = useState<Region>('Todos')
  const [month, setMonth] = useState<Month>('Todos')
  const [search, setSearch] = useState('')
  const [onlyDelayed, setOnlyDelayed] = useState(false)

  const filtered = ordersDataset
    .map((row) => ({
      ...row,
      normalizedTotal: row.total * (row.region === 'Norte' ? 1.1 : 0.98)
    }))
    .filter((row) => (region === 'Todos' ? true : row.region === region))
    .filter((row) => (month === 'Todos' ? true : row.month === month))
    .filter((row) => row.customer.toLowerCase().includes(search.toLowerCase()))
    .filter((row) => (onlyDelayed ? row.status === 'delayed' : true))

  const totalRevenue = filtered.reduce((acc, row) => acc + row.normalizedTotal, 0)
  const volatility = filtered.reduce((acc, row) => {
    return (
      acc +
      row.timeline.reduce((inner, value, index) => {
        if (index === 0) return inner
        return inner + Math.abs(value - row.timeline[index - 1])
      }, 0)
    )
  }, 0)

  const synthetic = slowCompute(filtered.length + search.length * 10)

  return (
    <section>
      <h1>Reports</h1>
      <p>Escenario de reportes con filtros dependientes + cálculos costosos sin memo.</p>

      <div className="filters-grid">
        <label>
          Región
          <select value={region} onChange={(e) => setRegion(e.target.value as Region)}>
            {regions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Mes
          <select value={month} onChange={(e) => setMonth(e.target.value as Month)}>
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Buscar cliente
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ej. Auralia" />
        </label>
        <label className="toggle-field">
          <input type="checkbox" checked={onlyDelayed} onChange={(e) => setOnlyDelayed(e.target.checked)} />
          Solo órdenes retrasadas
        </label>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Órdenes filtradas" value={filtered.length} helper="Se recalcula en cada render" />
        <KpiCard
          label="Ingreso normalizado"
          value={`$${totalRevenue.toLocaleString('es-MX')}`}
          helper="Suma sin memo ni formateo cacheado"
        />
        <KpiCard label="Volatilidad" value={volatility.toFixed(1)} helper="Derivada del timeline" />
        <KpiCard
          label="Synthetic load"
          value={synthetic}
          helper="Usa slowCompute para simular trabajo O(n)"
        />
      </div>

      <ReportTable rows={filtered} />
    </section>
  )
}
