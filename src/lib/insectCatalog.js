// Sample insects for the AI Insect Scanner demo. There is no live model here — this is a
// mocked classification flow that demonstrates the idea of photo-based pollinator/pest
// identification (per Erik Glemser's suggestion to compare photos against known insect
// references, e.g. BugGuide).

export const InsectRole = {
  POLLINATOR: 'pollinator',
  PEST: 'pest',
  BOTH: 'both',
  UNKNOWN: 'unknown',
}

export const INSECT_SAMPLES = [
  {
    id: 'bumblebee',
    label: 'Bumblebee',
    icon: '🐝',
    role: InsectRole.POLLINATOR,
    confidencePct: 96,
    description: 'Potentially beneficial for pollinating flowering crops. Consider exposure risk before any insecticide application.',
  },
  {
    id: 'honeybee',
    label: 'Honeybee',
    icon: '🐝',
    role: InsectRole.POLLINATOR,
    confidencePct: 94,
    description: 'Key managed pollinator species. Highly sensitive to insecticide drift during active foraging.',
  },
  {
    id: 'monarch',
    label: 'Monarch butterfly',
    icon: '🦋',
    role: InsectRole.POLLINATOR,
    confidencePct: 91,
    description: 'Migratory pollinator; presence varies by season. Sensitive to insecticide exposure near flowering plants.',
  },
  {
    id: 'japanese-beetle',
    label: 'Japanese beetle',
    icon: '🪲',
    role: InsectRole.PEST,
    confidencePct: 88,
    description: 'Known crop pest that feeds on leaves and flowers. Confirm population levels before treating.',
  },
  {
    id: 'aphid',
    label: 'Aphid',
    icon: '🐛',
    role: InsectRole.PEST,
    confidencePct: 85,
    description: 'Common crop pest that can transmit plant viruses. Check an economic treatment threshold before spraying.',
  },
  {
    id: 'hoverfly',
    label: 'Hoverfly',
    icon: '🪰',
    role: InsectRole.BOTH,
    confidencePct: 72,
    description: 'Visually mimics bees/wasps. Larvae prey on aphids (beneficial); adults also pollinate flowers.',
  },
  {
    id: 'unidentified',
    label: 'Unclear photo',
    icon: '❓',
    role: InsectRole.UNKNOWN,
    confidencePct: 40,
    description: 'Confidence is too low for a reliable identification. Recommend a clearer photo or manual review.',
  },
]

export function findInsectSample(id) {
  return INSECT_SAMPLES.find((i) => i.id === id)
}
