import { describe, expect, it } from 'vitest'
import { findInsectSample, InsectRole, INSECT_SAMPLES } from './insectCatalog'

describe('INSECT_SAMPLES', () => {
  it('has unique ids', () => {
    const ids = INSECT_SAMPLES.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every sample has a role from InsectRole', () => {
    for (const sample of INSECT_SAMPLES) {
      expect(Object.values(InsectRole)).toContain(sample.role)
    }
  })

  it('every sample has a confidence between 0 and 100', () => {
    for (const sample of INSECT_SAMPLES) {
      expect(sample.confidencePct).toBeGreaterThanOrEqual(0)
      expect(sample.confidencePct).toBeLessThanOrEqual(100)
    }
  })

  it('includes at least one sample of each role, so the UI can demonstrate every role tag', () => {
    const roles = new Set(INSECT_SAMPLES.map((i) => i.role))
    expect(roles).toEqual(new Set(Object.values(InsectRole)))
  })

  it('the unknown-role sample has the lowest confidence of the set', () => {
    const unknown = INSECT_SAMPLES.find((i) => i.role === InsectRole.UNKNOWN)
    const maxOtherConfidence = Math.max(
      ...INSECT_SAMPLES.filter((i) => i.role !== InsectRole.UNKNOWN).map((i) => i.confidencePct),
    )
    expect(unknown.confidencePct).toBeLessThan(maxOtherConfidence)
  })
})

describe('findInsectSample', () => {
  it('finds a sample by id', () => {
    expect(findInsectSample('bumblebee')?.label).toBe('Bumblebee')
  })

  it('returns undefined for an unknown id', () => {
    expect(findInsectSample('does-not-exist')).toBeUndefined()
  })
})
