import Chart from "../components/Chart";

export default function Dashboard() {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Chart recalcula data costosa en cada render.</p>
      <Chart size={1000} />
    </section>
  )
}
