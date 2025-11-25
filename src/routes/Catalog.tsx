import { useEffect, useMemo, useState } from 'react'
import ProductList from '../components/ProductList'

export default function Catalog() {
  const [q, setQ] = useState('')
  const products = useMemo(
    () => Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Producto ${i}` })),
    []
  )

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    let sum = 0
    for (let i = 0; i < 1e6; i++) sum += i % 7
    void sum
  })

  return (
    <section>
      <h1>Catalog</h1>
      <input
        className="catalog-input"
        placeholder="Filtrar…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ProductList items={filtered} />
    </section>
  )
}
