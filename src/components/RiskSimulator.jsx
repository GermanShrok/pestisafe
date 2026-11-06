import { useMemo, useState } from 'react'
import { CROPS, findCrop, findPesticideType, PESTICIDE_TYPES } from '../lib/catalog'
import { assessRisk, PollinatorActivity } from '../lib/riskAssessment'
import RiskBadge from './RiskBadge'

const DEFAULTS = {
  windSpeedKmh: 8,
  temperatureC: 22,
  humidityPct: 55,
  pollinatorActivity: PollinatorActivity.LOW,
  cropBlooming: false,
  cropId: 'canola',
  pesticideTypeId: 'insecticide',
}

const ACTIVITY_OPTIONS = [
  { value: PollinatorActivity.NONE, label: 'None observed' },
  { value: PollinatorActivity.LOW, label: 'Low' },
  { value: PollinatorActivity.MODERATE, label: 'Moderate' },
  { value: PollinatorActivity.HIGH, label: 'High' },
]

export default function RiskSimulator() {
  const [reading, setReading] = useState(DEFAULTS)

  const result = useMemo(() => {
    const crop = findCrop(reading.cropId)
    const pesticide = findPesticideType(reading.pesticideTypeId)
    return assessRisk({
      windSpeedKmh: reading.windSpeedKmh,
      temperatureC: reading.temperatureC,
      humidityPct: reading.humidityPct,
      pollinatorActivity: reading.pollinatorActivity,
      cropBlooming: reading.cropBlooming,
      cropAttractiveness: crop.attractiveness,
      pesticideToxicity: pesticide.toxicity,
    })
  }, [reading])

  const update = (patch) => setReading((prev) => ({ ...prev, ...patch }))
  const reset = () => setReading(DEFAULTS)

  return (
    <section className="simulator" aria-labelledby="simulator-heading">
      <div className="page-header">
        <h1 id="simulator-heading">Spraying risk simulator</h1>
        <p>
          Change the values below to see how PestiSafe's proposed decision logic responds — the same logic
          that drives the dashboard.
        </p>
      </div>

      <div className="simulator__layout">
        <form className="simulator__form card" onSubmit={(e) => e.preventDefault()}>
          <label className="field" htmlFor="wind">
            <span>Wind speed: {reading.windSpeedKmh} km/h</span>
            <input
              id="wind"
              type="range"
              min="0"
              max="40"
              step="1"
              value={reading.windSpeedKmh}
              onChange={(e) => update({ windSpeedKmh: Number(e.target.value) })}
            />
          </label>

          <label className="field" htmlFor="temperature">
            <span>Temperature: {reading.temperatureC} °C</span>
            <input
              id="temperature"
              type="range"
              min="-10"
              max="45"
              step="1"
              value={reading.temperatureC}
              onChange={(e) => update({ temperatureC: Number(e.target.value) })}
            />
          </label>

          <label className="field" htmlFor="humidity">
            <span>Humidity: {reading.humidityPct}%</span>
            <input
              id="humidity"
              type="range"
              min="0"
              max="100"
              step="1"
              value={reading.humidityPct}
              onChange={(e) => update({ humidityPct: Number(e.target.value) })}
            />
          </label>

          <label className="field" htmlFor="pollinator-activity">
            <span>Pollinator activity near field</span>
            <select
              id="pollinator-activity"
              value={reading.pollinatorActivity}
              onChange={(e) => update({ pollinatorActivity: e.target.value })}
            >
              {ACTIVITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="crop-type">
            <span>Crop type</span>
            <select id="crop-type" value={reading.cropId} onChange={(e) => update({ cropId: e.target.value })}>
              {CROPS.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field" htmlFor="pesticide-type">
            <span>Pesticide type</span>
            <select
              id="pesticide-type"
              value={reading.pesticideTypeId}
              onChange={(e) => update({ pesticideTypeId: e.target.value })}
            >
              {PESTICIDE_TYPES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field-checkbox" htmlFor="crop-blooming">
            <input
              id="crop-blooming"
              type="checkbox"
              checked={reading.cropBlooming}
              onChange={(e) => update({ cropBlooming: e.target.checked })}
            />
            <span>Crop is currently blooming</span>
          </label>

          <button type="button" className="btn" onClick={reset}>
            Reset simulation
          </button>
        </form>

        <div className="simulator__result card">
          <RiskBadge level={result.level} />
          <h3>Triggered factors</h3>
          <ul className="simulator__reasons">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="disclaimer">
            This is an educational logic demonstration, not a validated spray-risk calculator. Actual
            decisions require product-label instructions, weather assessment, and professional guidance.
          </p>
        </div>
      </div>
    </section>
  )
}
