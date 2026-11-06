import { describe, expect, it } from 'vitest'
import { getRecommendation, SCENARIOS } from './dashboardScenarios'
import { assessRisk, RiskLevel } from './riskAssessment'

describe('SCENARIOS', () => {
  it('has at least one scenario', () => {
    expect(SCENARIOS.length).toBeGreaterThan(0)
  })

  it('every scenario reading is valid input for assessRisk', () => {
    for (const scenario of SCENARIOS) {
      expect(() => assessRisk(scenario.reading)).not.toThrow()
    }
  })

  it('every scenario has a field name and a non-negative bee visit count', () => {
    for (const scenario of SCENARIOS) {
      expect(scenario.fieldName).toEqual(expect.any(String))
      expect(scenario.fieldName.length).toBeGreaterThan(0)
      expect(scenario.beeVisitsPer5Min).toBeGreaterThanOrEqual(0)
    }
  })

  it('scenario ids are unique', () => {
    const ids = SCENARIOS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes at least one RED and one GREEN-or-YELLOW scenario, to demonstrate the signal actually changes', () => {
    const levels = SCENARIOS.map((s) => assessRisk(s.reading).level)
    expect(levels).toContain(RiskLevel.RED)
    expect(levels.some((l) => l !== RiskLevel.RED)).toBe(true)
  })
})

describe('getRecommendation', () => {
  it('returns a delay message for RED', () => {
    expect(getRecommendation(RiskLevel.RED)).toMatch(/Delay spraying/)
  })

  it('returns a caution message for YELLOW', () => {
    expect(getRecommendation(RiskLevel.YELLOW)).toMatch(/caution/)
  })

  it('returns a proceed message for GREEN', () => {
    expect(getRecommendation(RiskLevel.GREEN)).toMatch(/support proceeding/)
  })

  it('falls back to the caution message for an unrecognized level', () => {
    expect(getRecommendation('unknown')).toBe(getRecommendation(RiskLevel.YELLOW))
  })
})
