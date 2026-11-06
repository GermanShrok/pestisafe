import { describe, expect, it } from 'vitest'
import {
  assessRisk,
  CropAttractiveness,
  HUMIDITY_CAUTION_PCT,
  PesticideToxicity,
  PollinatorActivity,
  RiskLevel,
  TEMP_CAUTION_C,
  TEMP_HIGH_RISK_C,
  WIND_CAUTION_KMH,
  WIND_HIGH_RISK_KMH,
} from './riskAssessment'

const baseline = {
  windSpeedKmh: 0,
  temperatureC: 20,
  humidityPct: 40,
  pollinatorActivity: PollinatorActivity.NONE,
  cropBlooming: false,
  pesticideToxicity: PesticideToxicity.HIGH,
  cropAttractiveness: CropAttractiveness.LOW,
}

describe('assessRisk — input validation', () => {
  it('rejects a non-numeric wind speed', () => {
    expect(() => assessRisk({ ...baseline, windSpeedKmh: 'fast' })).toThrow(TypeError)
  })

  it('rejects a negative wind speed', () => {
    expect(() => assessRisk({ ...baseline, windSpeedKmh: -1 })).toThrow(TypeError)
  })

  it('rejects NaN temperature', () => {
    expect(() => assessRisk({ ...baseline, temperatureC: NaN })).toThrow(TypeError)
  })

  it('rejects humidity below 0', () => {
    expect(() => assessRisk({ ...baseline, humidityPct: -5 })).toThrow(TypeError)
  })

  it('rejects humidity above 100', () => {
    expect(() => assessRisk({ ...baseline, humidityPct: 101 })).toThrow(TypeError)
  })

  it('rejects an unknown pollinator activity level', () => {
    expect(() => assessRisk({ ...baseline, pollinatorActivity: 'swarming' })).toThrow(TypeError)
  })

  it('rejects a non-boolean cropBlooming', () => {
    expect(() => assessRisk({ ...baseline, cropBlooming: 'yes' })).toThrow(TypeError)
  })

  it('rejects an unknown pesticideToxicity', () => {
    expect(() => assessRisk({ ...baseline, pesticideToxicity: 'medium' })).toThrow(TypeError)
  })

  it('rejects an unknown cropAttractiveness', () => {
    expect(() => assessRisk({ ...baseline, cropAttractiveness: 'extreme' })).toThrow(TypeError)
  })
})

describe('assessRisk — baseline', () => {
  it('returns GREEN with a reassuring reason when every factor is nominal', () => {
    const result = assessRisk(baseline)
    expect(result.level).toBe(RiskLevel.GREEN)
    expect(result.reasons).toEqual(['All monitored conditions are within safe ranges.'])
  })
})

describe('assessRisk — wind thresholds', () => {
  it('stays GREEN just below the caution threshold', () => {
    const result = assessRisk({ ...baseline, windSpeedKmh: WIND_CAUTION_KMH - 0.1 })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('escalates to YELLOW exactly at the caution threshold', () => {
    const result = assessRisk({ ...baseline, windSpeedKmh: WIND_CAUTION_KMH })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })

  it('stays YELLOW just below the high-risk threshold', () => {
    const result = assessRisk({ ...baseline, windSpeedKmh: WIND_HIGH_RISK_KMH - 0.1 })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })

  it('escalates to RED exactly at the high-risk threshold', () => {
    const result = assessRisk({ ...baseline, windSpeedKmh: WIND_HIGH_RISK_KMH })
    expect(result.level).toBe(RiskLevel.RED)
  })

  it('stays RED well above the high-risk threshold', () => {
    const result = assessRisk({ ...baseline, windSpeedKmh: 40 })
    expect(result.level).toBe(RiskLevel.RED)
  })
})

describe('assessRisk — temperature thresholds', () => {
  it('stays GREEN just below the caution threshold', () => {
    const result = assessRisk({ ...baseline, temperatureC: TEMP_CAUTION_C - 0.1 })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('escalates to YELLOW exactly at the caution threshold', () => {
    const result = assessRisk({ ...baseline, temperatureC: TEMP_CAUTION_C })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })

  it('escalates to RED exactly at the high-risk threshold', () => {
    const result = assessRisk({ ...baseline, temperatureC: TEMP_HIGH_RISK_C })
    expect(result.level).toBe(RiskLevel.RED)
  })

  it('handles sub-zero temperatures as GREEN', () => {
    const result = assessRisk({ ...baseline, temperatureC: -5 })
    expect(result.level).toBe(RiskLevel.GREEN)
  })
})

describe('assessRisk — humidity', () => {
  it('stays GREEN just below the caution threshold', () => {
    const result = assessRisk({ ...baseline, humidityPct: HUMIDITY_CAUTION_PCT - 1 })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('escalates to YELLOW at the caution threshold, never directly to RED', () => {
    const result = assessRisk({ ...baseline, humidityPct: 100 })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })
})

describe('assessRisk — pollinator activity (high-toxicity pesticide, e.g. insecticide)', () => {
  it('NONE contributes no escalation', () => {
    const result = assessRisk({ ...baseline, pollinatorActivity: PollinatorActivity.NONE })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('LOW alone does not escalate beyond GREEN', () => {
    const result = assessRisk({ ...baseline, pollinatorActivity: PollinatorActivity.LOW })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('MODERATE escalates to YELLOW', () => {
    const result = assessRisk({ ...baseline, pollinatorActivity: PollinatorActivity.MODERATE })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })

  it('HIGH escalates to RED', () => {
    const result = assessRisk({ ...baseline, pollinatorActivity: PollinatorActivity.HIGH })
    expect(result.level).toBe(RiskLevel.RED)
  })
})

describe('assessRisk — pollinator activity (low-toxicity pesticide, e.g. herbicide/fungicide)', () => {
  it('HIGH pollinator activity is capped at YELLOW, not RED, and explains why', () => {
    const result = assessRisk({
      ...baseline,
      pesticideToxicity: PesticideToxicity.LOW,
      pollinatorActivity: PollinatorActivity.HIGH,
    })
    expect(result.level).toBe(RiskLevel.YELLOW)
    expect(result.reasons.some((r) => r.includes('mode of action'))).toBe(true)
  })

  it('blooming + high-attractiveness crop + pollinators present is capped at YELLOW', () => {
    const result = assessRisk({
      ...baseline,
      pesticideToxicity: PesticideToxicity.LOW,
      cropAttractiveness: CropAttractiveness.HIGH,
      cropBlooming: true,
      pollinatorActivity: PollinatorActivity.LOW,
    })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })
})

describe('assessRisk — crop bloom + attractiveness interaction (high-toxicity pesticide)', () => {
  it('blooming crop with NO pollinator activity does not escalate on its own', () => {
    const result = assessRisk({
      ...baseline,
      cropAttractiveness: CropAttractiveness.HIGH,
      cropBlooming: true,
      pollinatorActivity: PollinatorActivity.NONE,
    })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('HIGH attractiveness crop blooming with LOW pollinator activity escalates to RED', () => {
    const result = assessRisk({
      ...baseline,
      cropAttractiveness: CropAttractiveness.HIGH,
      cropBlooming: true,
      pollinatorActivity: PollinatorActivity.LOW,
    })
    expect(result.level).toBe(RiskLevel.RED)
    expect(result.reasons.some((r) => r.includes('canola-type bloom'))).toBe(true)
  })

  it('MODERATE attractiveness crop blooming with LOW pollinator activity escalates only to YELLOW', () => {
    const result = assessRisk({
      ...baseline,
      cropAttractiveness: CropAttractiveness.MODERATE,
      cropBlooming: true,
      pollinatorActivity: PollinatorActivity.LOW,
    })
    expect(result.level).toBe(RiskLevel.YELLOW)
  })

  it('LOW attractiveness crop (e.g. wheat) blooming with LOW pollinator activity stays GREEN', () => {
    const result = assessRisk({
      ...baseline,
      cropAttractiveness: CropAttractiveness.LOW,
      cropBlooming: true,
      pollinatorActivity: PollinatorActivity.LOW,
    })
    expect(result.level).toBe(RiskLevel.GREEN)
  })

  it('non-blooming HIGH attractiveness crop with LOW pollinator activity stays GREEN', () => {
    const result = assessRisk({
      ...baseline,
      cropAttractiveness: CropAttractiveness.HIGH,
      cropBlooming: false,
      pollinatorActivity: PollinatorActivity.LOW,
    })
    expect(result.level).toBe(RiskLevel.GREEN)
  })
})

describe('assessRisk — combined worst-case and never-downgrades behavior', () => {
  it('takes the single worst factor, not an average', () => {
    const result = assessRisk({
      ...baseline,
      windSpeedKmh: WIND_HIGH_RISK_KMH,
      temperatureC: 5, // deliberately safe
      humidityPct: 10, // deliberately safe
      pollinatorActivity: PollinatorActivity.NONE,
      cropBlooming: false,
    })
    expect(result.level).toBe(RiskLevel.RED)
  })

  it('collects a reason per contributing factor', () => {
    const result = assessRisk({
      ...baseline,
      windSpeedKmh: WIND_CAUTION_KMH,
      temperatureC: TEMP_CAUTION_C,
      humidityPct: HUMIDITY_CAUTION_PCT,
      pollinatorActivity: PollinatorActivity.MODERATE,
      cropBlooming: false,
    })
    expect(result.level).toBe(RiskLevel.YELLOW)
    expect(result.reasons).toHaveLength(4)
  })

  it('is a pure function: same input always produces the same output', () => {
    const input = { ...baseline, windSpeedKmh: 12 }
    expect(assessRisk(input)).toEqual(assessRisk(input))
  })
})
