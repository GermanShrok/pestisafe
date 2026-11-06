import { useMemo, useState } from 'react'
import RiskBadge from '../components/RiskBadge'
import { getRecommendation, SCENARIOS } from '../lib/dashboardScenarios'
import { assessRisk } from '../lib/riskAssessment'

export default function Dashboard() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const scenario = SCENARIOS[scenarioIndex]
  const result = useMemo(() => assessRisk(scenario.reading), [scenario])

  const nextScenario = () => setScenarioIndex((i) => (i + 1) % SCENARIOS.length)

  return (
    <section className="page" aria-labelledby="dashboard-heading">
      <div className="page-header">
        <h1 id="dashboard-heading">Live farm safety monitor</h1>
        <p>A mock dashboard showing what a farmer would see from a deployed PestiSafe sensor.</p>
      </div>

      <div className="dashboard__layout">
        <div className="card">
          <div className="dashboard__field-name">
            <h2>{scenario.fieldName}</h2>
            <span className="dashboard__badge">Demo mode</span>
          </div>

          <RiskBadge level={result.level} />

          <div className="dashboard__readings">
            <div className="dashboard__reading">
              <div className="dashboard__reading-label">Wind speed</div>
              <div className="dashboard__reading-value">{scenario.reading.windSpeedKmh} km/h</div>
            </div>
            <div className="dashboard__reading">
              <div className="dashboard__reading-label">Temperature</div>
              <div className="dashboard__reading-value">{scenario.reading.temperatureC}°C</div>
            </div>
            <div className="dashboard__reading">
              <div className="dashboard__reading-label">Humidity</div>
              <div className="dashboard__reading-value">{scenario.reading.humidityPct}%</div>
            </div>
            <div className="dashboard__reading">
              <div className="dashboard__reading-label">Bee visits / 5 min</div>
              <div className="dashboard__reading-value">{scenario.beeVisitsPer5Min}</div>
            </div>
          </div>

          <div className="dashboard__recommendation">
            <h3>Recommendation</h3>
            <p>{getRecommendation(result.level)}</p>
          </div>

          <button type="button" className="btn btn--accent" onClick={nextScenario}>
            Simulate next reading
          </button>

          <p className="disclaimer">Illustrative dashboard using fictional demonstration readings.</p>
        </div>

        <div className="card">
          <h3>Why this reading</h3>
          <ul className="simulator__reasons">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
