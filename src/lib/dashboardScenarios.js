import { CropAttractiveness, PesticideToxicity, PollinatorActivity, RiskLevel } from './riskAssessment'

// Illustrative demo readings — not live sensor data. Cycling through these lets the
// dashboard demonstrate that the recommendation updates automatically as conditions change.
export const SCENARIOS = [
  {
    id: 'calm-morning',
    fieldName: 'North Canola Field',
    beeVisitsPer5Min: 0,
    reading: {
      windSpeedKmh: 4,
      temperatureC: 18,
      humidityPct: 60,
      pollinatorActivity: PollinatorActivity.NONE,
      cropBlooming: true,
      cropAttractiveness: CropAttractiveness.HIGH,
      pesticideToxicity: PesticideToxicity.HIGH,
    },
  },
  {
    id: 'active-foraging',
    fieldName: 'North Canola Field',
    beeVisitsPer5Min: 18,
    reading: {
      windSpeedKmh: 12,
      temperatureC: 26,
      humidityPct: 42,
      pollinatorActivity: PollinatorActivity.HIGH,
      cropBlooming: true,
      cropAttractiveness: CropAttractiveness.HIGH,
      pesticideToxicity: PesticideToxicity.HIGH,
    },
  },
  {
    id: 'windy-afternoon',
    fieldName: 'East Soybean Field',
    beeVisitsPer5Min: 5,
    reading: {
      windSpeedKmh: 12,
      temperatureC: 29,
      humidityPct: 38,
      pollinatorActivity: PollinatorActivity.MODERATE,
      cropBlooming: false,
      cropAttractiveness: CropAttractiveness.MODERATE,
      pesticideToxicity: PesticideToxicity.HIGH,
    },
  },
  {
    id: 'herbicide-pass',
    fieldName: 'South Wheat Field',
    beeVisitsPer5Min: 1,
    reading: {
      windSpeedKmh: 7,
      temperatureC: 21,
      humidityPct: 50,
      pollinatorActivity: PollinatorActivity.NONE,
      cropBlooming: false,
      cropAttractiveness: CropAttractiveness.LOW,
      pesticideToxicity: PesticideToxicity.LOW,
    },
  },
]

const RECOMMENDATIONS = {
  [RiskLevel.RED]: 'Delay spraying. Review the pesticide label and check conditions again later.',
  [RiskLevel.YELLOW]: 'Proceed with caution. Re-check conditions close to spray time and follow label restrictions.',
  [RiskLevel.GREEN]: 'Conditions currently support proceeding, pending a final label and weather check.',
}

export function getRecommendation(level) {
  return RECOMMENDATIONS[level] ?? RECOMMENDATIONS[RiskLevel.YELLOW]
}
