const regions = ['Norte', 'Sur', 'Este', 'Oeste'] as const
const statuses = ['delayed', 'on-time'] as const
const agents = ['Ada', 'Grace', 'Linus', 'Ken', 'Margaret']
const priorities = ['low', 'medium', 'high'] as const

function createRandom(seed = 42) {
  let value = seed % 2147483647
  return () => {
    value = (value * 16807) % 2147483647
    return value / 2147483647
  }
}

const rng = createRandom(7)

export type OrderRow = {
  id: string
  customer: string
  region: (typeof regions)[number]
  total: number
  month: string
  status: (typeof statuses)[number]
  timeline: number[]
  items: Array<{ sku: string; qty: number; price: number }>
}

export type Ticket = {
  id: string
  title: string
  description: string
  priority: (typeof priorities)[number]
  assignee: string
  channel: 'chat' | 'email' | 'phone'
  sentiment: number
  tags: string[]
  updates: Array<{ ts: number; summary: string }>
}

function randomList<T>(pool: T[], n: number) {
  return Array.from({ length: n }, () => pool[Math.floor(rng() * pool.length)])
}

const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06']
const customers = ['Auralia', 'Zione', 'Nebula Foods', 'Cobalt Logistics', 'Solara', 'Nyx Labs']
const skus = ['ALPHA-01', 'ALPHA-02', 'ALPHA-03', 'BRAVO-01', 'DELTA-07', 'PHI-02']
const ticketTags = ['sla', 'fraud', 'outage', 'refund', 'priority', 'logistics', 'pricing']

export function buildOrderDataset(size = 1500): OrderRow[] {
  return Array.from({ length: size }, (_, i) => {
    const itemCount = 2 + Math.floor(rng() * 4)
    const items = Array.from({ length: itemCount }, () => {
      const price = 40 + Math.round(rng() * 600)
      return { sku: skus[Math.floor(rng() * skus.length)], qty: 1 + Math.floor(rng() * 6), price }
    })
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const timeline = Array.from({ length: 14 }, () => parseFloat((rng() * 10).toFixed(2)))

    return {
      id: `ORD-${(1000 + i).toString().padStart(4, '0')}`,
      customer: customers[Math.floor(rng() * customers.length)],
      region: regions[Math.floor(rng() * regions.length)],
      total,
      month: months[Math.floor(rng() * months.length)],
      status: statuses[Math.floor(rng() * statuses.length)],
      timeline,
      items
    }
  })
}

export function buildTicketDataset(size = 400): Ticket[] {
  const channels: Ticket['channel'][] = ['chat', 'email', 'phone']
  const subjects = ['Reclamación', 'Reintento', 'Sincronización', 'Anulación', 'Duplicado', 'Migración']
  const templates = [
    'El cliente indica retrasos en los envíos y adjunta logs con {files} archivos.',
    'Solicita explicación sobre ajustes de precio para {sku}.',
    'Advierte posible fraude por {events} transacciones fallidas.',
    'Pide reasignar pedido crítico con prioridad {priority}.',
    'Marca caída intermitente en el flujo de checkout y comparte {files} capturas.'
  ]

  return Array.from({ length: size }, (_, i) => {
    const template = templates[Math.floor(rng() * templates.length)]
    const files = 1 + Math.floor(rng() * 5)
    const sku = skus[Math.floor(rng() * skus.length)]
    const events = 2 + Math.floor(rng() * 10)
    const description = template
      .replace('{files}', String(files))
      .replace('{sku}', sku)
      .replace('{events}', String(events))
      .replace('{priority}', priorities[Math.floor(rng() * priorities.length)])

    return {
      id: `TCK-${(500 + i).toString().padStart(4, '0')}`,
      title: `${subjects[Math.floor(rng() * subjects.length)]} ${i}`,
      description,
      priority: priorities[Math.floor(rng() * priorities.length)],
      assignee: agents[Math.floor(rng() * agents.length)],
      channel: channels[Math.floor(rng() * channels.length)],
      sentiment: parseFloat(((rng() * 2 - 1) * 100).toFixed(0)),
      tags: randomList(ticketTags, 2 + Math.floor(rng() * 3)),
      updates: Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({
        ts: Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * 4),
        summary: randomList(subjects, 1)[0]
      }))
    }
  })
}

export const ordersDataset = buildOrderDataset(1800)
export const ticketsDataset = buildTicketDataset(450)
