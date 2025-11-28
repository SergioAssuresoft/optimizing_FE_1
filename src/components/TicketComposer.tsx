import { memo, useMemo, useState } from 'react'

const defaultDraft = {
  title: 'Seguimiento SLA',
  description: 'Detalle del comportamiento del SLA.'
}

type SubmitArgs = {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

function TicketComposer({ onSubmit }: { onSubmit: (draft: SubmitArgs) => void }) {
  const [draft, setDraft] = useState<SubmitArgs>({ ...defaultDraft, priority: 'medium' })

  const preview = useMemo(() => buildPreview(draft.description), [draft.description])

  return (
    <div className="ticket-composer">
      <form
        className="ticket-composer__form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(draft)
        }}
      >
        <label>
          Título
          <input
            value={draft.title}
            onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          />
        </label>
        <label>
          Prioridad
          <select
            value={draft.priority}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, priority: e.target.value as SubmitArgs['priority'] }))
            }
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </label>
        <label>
          Descripción
          <textarea
            rows={6}
            value={draft.description}
            onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
          />
        </label>
        <button type="submit">Crear ticket sintético</button>
      </form>
      <div className="ticket-composer__preview">
        <p className="ticket-composer__preview-label">Vista previa generada en caliente</p>
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
    </div>
  )
}

export default memo(TicketComposer);

function buildPreview(text: string) {
  const paragraphs = text.split(/\n|\./).filter(Boolean)
  let processed = ''
  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ')
    const reversed = words.reverse().join(' ')
    processed += `<p>${highlightTokens(reversed)}</p>`
  }

  let hash = 0
  for (let i = 0; i < text.length * 200; i++) {
    hash = (hash + text.charCodeAt(i % text.length)) % 99991
  }
  processed += `<small class="preview-hash">hash:${hash}</small>`
  return processed
}

function highlightTokens(sentence: string) {
  return sentence
    .split(' ')
    .map((word) => (word.length > 6 ? `<strong>${word}</strong>` : word))
    .join(' ')
}
