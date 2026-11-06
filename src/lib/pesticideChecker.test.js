import { describe, expect, it } from 'vitest'
import {
  checkPesticide,
  findPesticideProduct,
  PESTICIDE_PRODUCTS,
  WarningSeverity,
} from './pesticideChecker'

describe('PESTICIDE_PRODUCTS', () => {
  it('has unique ids', () => {
    const ids = PESTICIDE_PRODUCTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes Matador 120EC as a bloom-restricted insecticide, matching the mentor feedback', () => {
    const matador = findPesticideProduct('matador-120ec')
    expect(matador).toBeDefined()
    expect(matador.category).toBe('Insecticide')
    expect(matador.bloomRestricted).toBe(true)
  })

  it('includes at least one non-bloom-restricted product (herbicide/fungicide)', () => {
    expect(PESTICIDE_PRODUCTS.some((p) => !p.bloomRestricted)).toBe(true)
  })
})

describe('findPesticideProduct', () => {
  it('returns undefined for an unknown id', () => {
    expect(findPesticideProduct('not-a-real-product')).toBeUndefined()
  })
})

describe('checkPesticide', () => {
  const matador = findPesticideProduct('matador-120ec')
  const fungicide = findPesticideProduct('example-fungicide')

  it('BLOCKs a bloom-restricted product when the crop is flowering and pollinators are detected', () => {
    const result = checkPesticide({ product: matador, cropFlowering: true, pollinatorsDetected: true })
    expect(result.severity).toBe(WarningSeverity.BLOCK)
    expect(result.message).toMatch(/Do not spray/)
  })

  it('cautions when only the crop is flowering', () => {
    const result = checkPesticide({ product: matador, cropFlowering: true, pollinatorsDetected: false })
    expect(result.severity).toBe(WarningSeverity.CAUTION)
  })

  it('cautions when only pollinators are detected', () => {
    const result = checkPesticide({ product: matador, cropFlowering: false, pollinatorsDetected: true })
    expect(result.severity).toBe(WarningSeverity.CAUTION)
  })

  it('is OK for a bloom-restricted product when neither condition is present', () => {
    const result = checkPesticide({ product: matador, cropFlowering: false, pollinatorsDetected: false })
    expect(result.severity).toBe(WarningSeverity.OK)
  })

  it('is always OK for a non-bloom-restricted product, even with bloom and pollinators present', () => {
    const result = checkPesticide({ product: fungicide, cropFlowering: true, pollinatorsDetected: true })
    expect(result.severity).toBe(WarningSeverity.OK)
    expect(result.message).toMatch(/lower pollinator risk/)
  })
})
