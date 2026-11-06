// Reference data for the simulator's crop and pesticide selectors.
// Attractiveness/toxicity groupings reflect mentor guidance: crops like canola are
// highly attractive to foraging pollinators while most cereals are not, and
// insecticides/miticides pose far more pollinator risk than herbicides/fungicides
// because of their mode of action.

import { CropAttractiveness, PesticideToxicity } from './riskAssessment'

export const CROPS = [
  { id: 'canola', label: 'Canola', attractiveness: CropAttractiveness.HIGH },
  { id: 'apple', label: 'Apple orchard', attractiveness: CropAttractiveness.HIGH },
  { id: 'squash', label: 'Squash / cucumber', attractiveness: CropAttractiveness.HIGH },
  { id: 'soybean', label: 'Soybean', attractiveness: CropAttractiveness.MODERATE },
  { id: 'wheat', label: 'Wheat', attractiveness: CropAttractiveness.LOW },
  { id: 'corn', label: 'Corn', attractiveness: CropAttractiveness.LOW },
]

export const PESTICIDE_TYPES = [
  { id: 'insecticide', label: 'Insecticide', toxicity: PesticideToxicity.HIGH },
  { id: 'miticide', label: 'Miticide', toxicity: PesticideToxicity.HIGH },
  { id: 'fungicide', label: 'Fungicide', toxicity: PesticideToxicity.LOW },
  { id: 'herbicide', label: 'Herbicide', toxicity: PesticideToxicity.LOW },
]

export function findCrop(id) {
  return CROPS.find((c) => c.id === id)
}

export function findPesticideType(id) {
  return PESTICIDE_TYPES.find((p) => p.id === id)
}
