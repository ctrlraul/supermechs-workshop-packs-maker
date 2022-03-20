import { writable } from 'svelte/store'
import type { Item } from './items/Item'


export interface ItemsPackData {
  version: string
  name: string
  description: string
  key: string
  items: Item[]
  spritesSheet: HTMLCanvasElement
  raw: any
}


export const itemsPackData = writable<ItemsPackData | null>(null)
