import { useMemo, useState } from 'react'
import TicketComposer from '../components/TicketComposer'
import TicketList from '../components/TicketList'
import KpiCard from '../components/KpiCard'
import { ticketsDataset, type Ticket } from '../utils/datasets'

const baseAgents = ['Todos', 'Ada', 'Grace', 'Linus', 'Ken', 'Margaret'] as const
type AgentOption = (typeof baseAgents)[number]

type PriorityFilter = 'Todos' | 'low' | 'medium' | 'high'

export default function Support() {
  const [tickets, setTickets] = useState<Ticket[]>(ticketsDataset)
  const [agent, setAgent] = useState<AgentOption>('Todos')
  const [priority, setPriority] = useState<PriorityFilter>('Todos')
  const [query, setQuery] = useState('')

  const filtered = tickets
    .map((ticket) => ({
      ...ticket,
      normalizedSentiment: ticket.sentiment / (ticket.priority === 'high' ? 2 : 1)
    }))
    .filter((ticket) => (agent === 'Todos' ? true : ticket.assignee === agent))
    .filter((ticket) => (priority === 'Todos' ? true : ticket.priority === priority))
    .filter((ticket) => ticket.title.toLowerCase().includes(query.toLowerCase()))

  const queueWeight = filtered.reduce((acc, ticket) => acc + ticket.normalizedSentiment, 0)
  const tagsInUse = filtered.reduce((acc, ticket) => acc + ticket.tags.length, 0)

  const busiestAgent = useMemo(() => {
    const counters = filtered.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.assignee] = (acc[ticket.assignee] ?? 0) + 1
      return acc
    }, {})
    return Object.entries(counters).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  }, [filtered])

  return (
    <section>
      <h1>Support</h1>
      <p>Simula un buzón de tickets con filtros dependientes y vista previa pesada.</p>

      <div className="filters-grid">
        <label>
          Agente
          <select value={agent} onChange={(e) => setAgent(e.target.value as AgentOption)}>
            {baseAgents.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Prioridad
          <select value={priority} onChange={(e) => setPriority(e.target.value as PriorityFilter)}>
            {['Todos', 'low', 'medium', 'high'].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Buscar
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej. SLA" />
        </label>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Tickets visibles" value={filtered.length} helper="Dataset sin paginar" />
        <KpiCard label="Peso de la cola" value={queueWeight.toFixed(0)} helper="Sentiment normalizado" />
        <KpiCard label="Tags en uso" value={tagsInUse} helper="Se recalcula por render" />
        <KpiCard label="Agente con más carga" value={busiestAgent} helper="useMemo sin deps finas" />
      </div>

      <TicketComposer
        onSubmit={(draft) => {
          const newTicket: Ticket = {
            id: `TCK-${Date.now()}`,
            title: draft.title,
            description: draft.description,
            priority: draft.priority,
            assignee: agent === 'Todos' ? 'Ada' : agent,
            channel: 'chat',
            sentiment: Math.round(Math.random() * 100),
            tags: ['workshop', 'manual', draft.priority],
            updates: [
              { ts: Date.now(), summary: 'Creado manualmente en la sesión' },
              { ts: Date.now() - 1000 * 60 * 60, summary: 'Sincronización pendiente' }
            ]
          }
          setTickets((state) => [newTicket, ...state])
        }}
      />

      <TicketList tickets={filtered} />
    </section>
  )
}
