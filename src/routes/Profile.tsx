import { useCart } from "../components/CartContext"

export default function Profile() {
  const { state, addItem } = useCart()
  return (
    <section>
      <h1>Profile</h1>
      <p>Context global dispara re-renders en toda la UI.</p>
      <button onClick={() => addItem({ id: Date.now(), name: 'X' })}>Agregar al carrito</button>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </section>
  )
}
