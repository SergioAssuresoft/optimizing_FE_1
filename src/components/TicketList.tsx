import type { Ticket } from '../utils/datasets'

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  const augmented = tickets.map((ticket) => {
    const derived = ticket.tags
      .concat(ticket.tags)
      .map((tag, index) => `${tag}-${index}`)
      .slice(0, 6)
    const density = ticket.updates.reduce((acc, update, index) => acc + index * update.ts, 0)
    return { ...ticket, derived, density }
  })

  return (
    <ul className="ticket-list">
      {augmented.map((ticket) => (
        <li key={ticket.id}>
          <div className="ticket-list__header">
            <strong>{ticket.title}</strong>
            <span className={`chip chip--${ticket.priority}`}>{ticket.priority}</span>
          </div>
          <p>{ticket.description}</p>
          <div className="ticket-list__meta">
            <span>Canal: {ticket.channel}</span>
            <span>Asignado a: {ticket.assignee}</span>
            <span>Sentimiento: {ticket.sentiment}</span>
          </div>
          <div className="ticket-tags">
            {ticket.derived.map((tag) => (
              <span key={`${ticket.id}-${tag}`}>{tag}</span>
            ))}
          </div>
          <small className="ticket-density">Densidad histórica: {ticket.density}</small>
        </li>
      ))}
    </ul>
  )
}
