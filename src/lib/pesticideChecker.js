// Pesticide product reference data and warning logic for the Pesticide Checker demo.
// Modeled directly on Erik Glemser's feedback: product category, active ingredient,
// bee toxicity, residual activity, and bloom-spraying restrictions all matter — and
// Matador 120EC was his specific example of a canola-approved insecticide with bee
// warnings and a bloom-spraying restriction.

export const PESTICIDE_PRODUCTS = [
  {
    id: 'matador-120ec',
    name: 'Matador 120EC',
    category: 'Insecticide',
    activeIngredient: 'Lambda-cyhalothrin',
    toxicityNote: 'Toxic to bees (low LD50)',
    residualActivity: true,
    bloomRestricted: true,
    labelNote: 'Label warns this product is toxic to bees and advises against spraying during crop bloom; apply in the evening when bees are not foraging.',
  },
  {
    id: 'example-miticide',
    name: 'Example Miticide',
    category: 'Miticide',
    activeIngredient: 'Example acaricide active',
    toxicityNote: 'Toxic to bees and other beneficial arthropods',
    residualActivity: true,
    bloomRestricted: true,
    labelNote: 'Label advises against applying to blooming crops while pollinators are foraging.',
  },
  {
    id: 'example-fungicide',
    name: 'Example Fungicide',
    category: 'Fungicide',
    activeIngredient: 'Example fungicide active',
    toxicityNote: 'Low acute toxicity to bees',
    residualActivity: false,
    bloomRestricted: false,
    labelNote: 'Generally lower pollinator risk due to its mode of action.',
  },
  {
    id: 'example-herbicide',
    name: 'Example Herbicide',
    category: 'Herbicide',
    activeIngredient: 'Example herbicide active',
    toxicityNote: 'Low acute toxicity to bees',
    residualActivity: false,
    bloomRestricted: false,
    labelNote: 'Generally lower pollinator risk due to its mode of action.',
  },
]

export function findPesticideProduct(id) {
  return PESTICIDE_PRODUCTS.find((p) => p.id === id)
}

export const WarningSeverity = {
  OK: 'ok',
  CAUTION: 'caution',
  BLOCK: 'block',
}

/**
 * Checks a product against current bloom/pollinator conditions and returns an
 * illustrative warning — not a live Canadian pesticide-label lookup.
 */
export function checkPesticide({ product, cropFlowering, pollinatorsDetected }) {
  if (!product.bloomRestricted) {
    return {
      severity: WarningSeverity.OK,
      message: `${product.category} products like this generally carry lower pollinator risk due to their mode of action. Still follow all label directions.`,
    }
  }

  if (cropFlowering && pollinatorsDetected) {
    return {
      severity: WarningSeverity.BLOCK,
      message: `${product.labelNote} Do not spray unless current official label requirements allow it.`,
    }
  }

  if (cropFlowering || pollinatorsDetected) {
    return {
      severity: WarningSeverity.CAUTION,
      message: `${product.labelNote} Review current label requirements before proceeding.`,
    }
  }

  return {
    severity: WarningSeverity.OK,
    message: 'No bloom or pollinator activity detected for this check. Still confirm current label requirements before spraying.',
  }
}
