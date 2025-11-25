// lista sin virtualizar, keys inestables (Math.random), re-render masivo
export default function ProductList({ items }: { items: Array<{ id: number; name: string }> }) {
  return (
    <ul className="product-grid">
      {items.map((p) => (
        <li key={Math.random()}>{p.name}</li>
      ))}
    </ul>
  )
}
  
