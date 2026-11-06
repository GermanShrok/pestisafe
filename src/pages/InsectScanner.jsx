import { useState } from 'react'
import { findInsectSample, INSECT_SAMPLES } from '../lib/insectCatalog'

const ROLE_LABEL = {
  pollinator: 'Pollinator',
  pest: 'Pest',
  both: 'Both pollinator and pest',
  unknown: 'Unknown / needs review',
}

export default function InsectScanner() {
  const [selectedId, setSelectedId] = useState(INSECT_SAMPLES[0].id)
  const [identified, setIdentified] = useState(false)

  const selected = findInsectSample(selectedId)

  const selectSample = (id) => {
    setSelectedId(id)
    setIdentified(false)
  }

  return (
    <section className="page" aria-labelledby="scanner-heading">
      <div className="page-header">
        <h1 id="scanner-heading">AI insect scanner</h1>
        <p>Pick a sample photo and PestiSafe will classify whether it's a pollinator, a pest, or both.</p>
      </div>

      <div className="scanner__layout">
        <div className="card">
          <h3>Sample photos</h3>
          <div className="scanner__samples">
            {INSECT_SAMPLES.map((sample) => (
              <button
                type="button"
                key={sample.id}
                className={`scanner__sample${sample.id === selectedId ? ' selected' : ''}`}
                onClick={() => selectSample(sample.id)}
                aria-pressed={sample.id === selectedId}
              >
                <span aria-hidden="true">{sample.icon}</span>
                <span className="scanner__sample-label">{sample.label}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--accent" onClick={() => setIdentified(true)}>
            Identify insect
          </button>
        </div>

        <div className="card">
          <h3>Result</h3>
          {!identified ? (
            <p>Choose a sample photo and click "Identify insect" to see a mock classification.</p>
          ) : (
            <div data-testid="scanner-result">
              <span className={`scanner__role-tag scanner__role-tag--${selected.role}`}>
                {ROLE_LABEL[selected.role]}
              </span>
              <p>
                <strong>Insect identified:</strong> {selected.label}
              </p>
              <p>
                <strong>Confidence:</strong> {selected.confidencePct}%
              </p>
              <p>{selected.description}</p>
              {selected.confidencePct < 60 && (
                <p className="disclaimer">Confidence is low — consider checking the identification manually.</p>
              )}
            </div>
          )}
          <p className="disclaimer">
            This is a mock identification, not a live AI model. A real version would compare photos against
            insect reference databases such as BugGuide.
          </p>
        </div>
      </div>
    </section>
  )
}
