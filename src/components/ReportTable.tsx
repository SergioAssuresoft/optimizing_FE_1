import type { OrderRow } from '../utils/datasets'

export default function ReportTable({ rows }: { rows: OrderRow[] }) {
  const sorted = [...rows]
    .map((row) => ({
      ...row,
      descriptor: row.items
        .map((item, idx) => `${idx + 1}-${item.sku}-${item.qty}`)
        .reverse()
        .join(' | '),
      volatility: row.timeline.reduce((acc, value, index) => {
        if (index === 0) return acc
        return acc + Math.abs(value - row.timeline[index - 1])
      }, 0)
    }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="table-scroll">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Región</th>
            <th>Total</th>
            <th>Volatilidad</th>
            <th>Items procesados</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className={row.status === 'delayed' ? 'is-delayed' : ''}>
              <td>{row.id}</td>
              <td>{row.customer}</td>
              <td>{row.region}</td>
              <td>${row.total.toLocaleString('es-MX')}</td>
              <td>{row.volatility.toFixed(1)}</td>
              <td>{row.descriptor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
