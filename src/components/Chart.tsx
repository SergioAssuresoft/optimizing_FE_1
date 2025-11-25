
export default function Chart({ size }: { size: number }) {
  const data = new Array(20000).fill(0).map((_, i) => Math.sin(i / 10))
  const sum = data.reduce((a, b) => a + b, 0)

  return (
    <div className="chart-card">
      <span className="chart-card__label">Emulación O(n)</span>
      <span className="chart-card__value">Size: {size}</span>
      <p className="chart-card__meta">Suma acumulada: {sum.toFixed(2)}</p>
    </div>
  )
}
  
