import rawStatsData from './StatFormats'



// Types

import type { StatFormat } from './StatFormats'
import type { Item } from '../items/Item'

export type StatInstructionWithImage = StatFormat & {
  imageURL: string
}



// Data

const STAT_IMAGES_BASE_URL = 'https://raw.githubusercontent.com/ctrl-raul/workshop-unlimited/master/src/assets/images/stats/'

const stats = {} as Record<keyof Item['stats'], StatInstructionWithImage>



// Functions

export function loadStatImages (): void {
  for (const instruction of rawStatsData) {
    stats[instruction.key] = {
      ...instruction,
      imageURL: STAT_IMAGES_BASE_URL + instruction.key + '.svg'
    }
  }
}


export function getStatInstruction (key: keyof Item['stats']): StatInstructionWithImage {

  if (stats[key]) {
    return stats[key]
  }

  throw new Error(`Stat '${key}' did not load or doesn't exist.`)

}


export function getAllStatInstructions (): StatInstructionWithImage[] {
  return Object.values(stats)
}
