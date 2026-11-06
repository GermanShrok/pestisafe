// Thresholds derived from mentor/agronomy guidance (Erik Glemser, University of Guelph):
// - Wind above ~10-15 km/h is generally unsafe for spraying (drift risk).
// - Some products restrict spraying above 30C.
// - High humidity can also affect drift/efficacy, so it nudges risk up near the wind/temp edges.
// - Pollinator activity directly scales exposure risk if spraying were to occur now.
// - Crop bloom matters because blooming crops (e.g. canola) attract foraging pollinators.
// - Insecticides and miticides pose the largest pollinator risk; herbicides and fungicides pose
//   much lower pollinator risk because of their mode of action, so pollinator/bloom factors are
//   capped lower for those product types rather than driving risk all the way to RED.

export const RiskLevel = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
}

export const PollinatorActivity = {
  NONE: 'none',
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
}

export const PesticideToxicity = {
  LOW: 'low',
  HIGH: 'high',
}

export const CropAttractiveness = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
}

export const WIND_CAUTION_KMH = 10
export const WIND_HIGH_RISK_KMH = 15
export const TEMP_CAUTION_C = 27
export const TEMP_HIGH_RISK_C = 30
export const HUMIDITY_CAUTION_PCT = 85

const ACTIVITY_SCORE = {
  [PollinatorActivity.NONE]: 0,
  [PollinatorActivity.LOW]: 1,
  [PollinatorActivity.MODERATE]: 2,
  [PollinatorActivity.HIGH]: 3,
}

function validateReading({
  windSpeedKmh,
  temperatureC,
  humidityPct,
  pollinatorActivity,
  cropBlooming,
  pesticideToxicity,
  cropAttractiveness,
}) {
  if (typeof windSpeedKmh !== 'number' || Number.isNaN(windSpeedKmh) || windSpeedKmh < 0) {
    throw new TypeError('windSpeedKmh must be a non-negative number')
  }
  if (typeof temperatureC !== 'number' || Number.isNaN(temperatureC)) {
    throw new TypeError('temperatureC must be a number')
  }
  if (typeof humidityPct !== 'number' || Number.isNaN(humidityPct) || humidityPct < 0 || humidityPct > 100) {
    throw new TypeError('humidityPct must be a number between 0 and 100')
  }
  if (!Object.values(PollinatorActivity).includes(pollinatorActivity)) {
    throw new TypeError(`pollinatorActivity must be one of ${Object.values(PollinatorActivity).join(', ')}`)
  }
  if (typeof cropBlooming !== 'boolean') {
    throw new TypeError('cropBlooming must be a boolean')
  }
  if (!Object.values(PesticideToxicity).includes(pesticideToxicity)) {
    throw new TypeError(`pesticideToxicity must be one of ${Object.values(PesticideToxicity).join(', ')}`)
  }
  if (!Object.values(CropAttractiveness).includes(cropAttractiveness)) {
    throw new TypeError(`cropAttractiveness must be one of ${Object.values(CropAttractiveness).join(', ')}`)
  }
}

/**
 * Computes a Green / Yellow / Red pesticide-spraying risk signal from live
 * field conditions. This is a proposed risk indicator only, not a
 * certification that spraying is safe or permitted.
 */
export function assessRisk(reading) {
  validateReading(reading)
  const {
    windSpeedKmh,
    temperatureC,
    humidityPct,
    pollinatorActivity,
    cropBlooming,
    pesticideToxicity,
    cropAttractiveness,
  } = reading

  const reasons = []
  let level = RiskLevel.GREEN

  const escalate = (candidate, reason) => {
    if (rank(candidate) > rank(level)) level = candidate
    reasons.push(reason)
  }

  // Wind — applies regardless of pesticide type; any product can drift.
  if (windSpeedKmh >= WIND_HIGH_RISK_KMH) {
    escalate(RiskLevel.RED, `Wind speed ${windSpeedKmh} km/h is at or above the ${WIND_HIGH_RISK_KMH} km/h high-drift-risk threshold.`)
  } else if (windSpeedKmh >= WIND_CAUTION_KMH) {
    escalate(RiskLevel.YELLOW, `Wind speed ${windSpeedKmh} km/h is at or above the ${WIND_CAUTION_KMH} km/h caution threshold.`)
  }

  // Temperature
  if (temperatureC >= TEMP_HIGH_RISK_C) {
    escalate(RiskLevel.RED, `Temperature ${temperatureC}C is at or above the ${TEMP_HIGH_RISK_C}C high-risk threshold.`)
  } else if (temperatureC >= TEMP_CAUTION_C) {
    escalate(RiskLevel.YELLOW, `Temperature ${temperatureC}C is at or above the ${TEMP_CAUTION_C}C caution threshold.`)
  }

  // Humidity (secondary factor, caution-only)
  if (humidityPct >= HUMIDITY_CAUTION_PCT) {
    escalate(RiskLevel.YELLOW, `Humidity ${humidityPct}% is at or above the ${HUMIDITY_CAUTION_PCT}% caution threshold.`)
  }

  const lowToxicity = pesticideToxicity === PesticideToxicity.LOW
  const pollinatorCap = lowToxicity ? RiskLevel.YELLOW : RiskLevel.RED
  const toxicityNote = lowToxicity
    ? ' This product type (herbicide/fungicide) carries comparatively lower pollinator risk due to its mode of action, so this is capped at caution.'
    : ''

  // Pollinator activity — capped at YELLOW for low-toxicity product types (herbicides/fungicides).
  if (pollinatorActivity === PollinatorActivity.HIGH) {
    escalate(pollinatorCap, `High pollinator activity detected near the field.${toxicityNote}`)
  } else if (pollinatorActivity === PollinatorActivity.MODERATE) {
    escalate(RiskLevel.YELLOW, 'Moderate pollinator activity detected near the field.')
  }

  // Crop bloom amplifies whatever pollinator activity is present, scaled by how attractive the
  // crop is to pollinators and how toxic the product is to them.
  const bloomActive = cropBlooming && ACTIVITY_SCORE[pollinatorActivity] >= ACTIVITY_SCORE[PollinatorActivity.LOW]
  if (bloomActive) {
    if (cropAttractiveness === CropAttractiveness.HIGH) {
      escalate(
        pollinatorCap,
        `Crop is blooming and highly attractive to pollinators (e.g. canola-type bloom) while pollinators are present, so exposure risk is elevated.${toxicityNote}`,
      )
    } else if (cropAttractiveness === CropAttractiveness.MODERATE) {
      escalate(RiskLevel.YELLOW, 'Crop is blooming and moderately attractive to pollinators while pollinators are present.')
    }
    // LOW attractiveness crops (e.g. cereals) don't add extra bloom-driven escalation —
    // pollinators have little reason to forage there even while blooming.
  }

  if (reasons.length === 0) {
    reasons.push('All monitored conditions are within safe ranges.')
  }

  return { level, reasons }
}

function rank(level) {
  switch (level) {
    case RiskLevel.RED:
      return 2
    case RiskLevel.YELLOW:
      return 1
    default:
      return 0
  }
}
