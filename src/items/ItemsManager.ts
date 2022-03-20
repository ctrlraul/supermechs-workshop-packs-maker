import importItemsPackV1 from './importItemsPackV1'
import importItemsPackV2 from './importItemsPackV2'
import Logger from '../utils/Logger'



// Types

import type { Item } from './Item'
import type { ItemsPackV1 } from './importItemsPackV1'
import type { ItemsPackV2 } from './importItemsPackV2'
import type { AttachmentPoint, TorsoAttachment } from './Item'
import { itemsPackData as itemsPackDataStore, ItemsPackData } from '../itemsPackDataStore'
import { get } from 'svelte/store'



// Types

export type ItemsPack = ItemsPackV1 | ItemsPackV2


type ImportedItemsData = Promise<[
  done: Item[],
  failed: { item: any, message: string }[],
  spritesSheet: HTMLCanvasElement
]>

export type ImportItemsPackFn <ItemsPack = any> = (itemsPack: ItemsPack, onProgress: (progress: number) => void) => ImportedItemsData





// Stuff

export const Tags = {
  TAG_ROLLER: 'roller'
}

const itemElements = ['PHYSICAL', 'EXPLOSIVE', 'ELECTRIC', 'COMBINED']
const logger = new Logger('ItemsManager')

let itemsPackData = get(itemsPackDataStore)

itemsPackDataStore.subscribe(value => itemsPackData = value)



// Methods


export async function importItemsPack (itemsPack: ItemsPack, onProgress: (progress: number) => void): Promise<ItemsPackData> {

  let importFn: ImportItemsPackFn
  let packData: Partial<ItemsPackData>


  // Pick the right function to import
  switch (itemsPack.version) {

    case '1':
      logger.log('Importing items pack version 1')
      importFn = importItemsPackV1
      packData = {
        version: itemsPack.version,
        key: itemsPack.config.key,
        name: itemsPack.config.name,
        description: itemsPack.config.description,
        raw: itemsPack
      }
      break
    
    case '2':
      logger.log('Importing items pack version 2')
      importFn = importItemsPackV2
      packData = {
        version: itemsPack.version,
        key: itemsPack.key,
        name: itemsPack.name,
        description: itemsPack.description,
        raw: itemsPack
      }
      break
    
    default:

      const { version, config } = itemsPack as ItemsPackV1

      logger.warn(`Items pack version missing or unknown (${version}). Importing as version 1`)
      importFn = importItemsPackV1
      packData = {
        version: '1',
        key: config.key,
        name: config.name,
        description: config.description,
        raw: itemsPack
      }

      break

  }

  const [done, failed, sprites] = await importFn(itemsPack, onProgress)

  if (failed.length) {
    throw new Error(`Failed to import items: ${failed.map(err => err.item.name + ' ' + err.message).join('\n')}`)
  }

  // Sort items by element
  done.sort((a, b) => itemElements.indexOf(a.element) > itemElements.indexOf(b.element) ? 1 : -1)

  packData.items = done
  packData.spritesSheet = sprites

  return packData as ItemsPackData

}


export function getItems (filter?: (item: Item) => boolean): Item[] {

  if (itemsPackData === null) {
    throw new Error('No pack imported')
  }
  
  return filter ? itemsPackData.items.filter(filter) : itemsPackData.items

}


export function getItemByID (id: Item['id']): Item | null {

  if (itemsPackData === null) {
    throw new Error('No pack imported')
  }

  if (id === 0) {
    return null
  }

  const item = itemsPackData.items.find(item => item.id === id)

  if (!item) {
    return null
  }

  return item

}


export function renderItem (ctx: CanvasRenderingContext2D, item: Item, x: number, y: number, width: number, height: number): void {

  if (itemsPackData === null) {
    throw new Error('No pack imported')
  }

  ctx.drawImage(
    itemsPackData.spritesSheet,
    item.image.x,
    item.image.y,
    item.image.width,
    item.image.height,
    x,
    y,
    width, 
    height
  )

}


export function createSyntheticItemAttachment (type: Item['type'], width: number, height: number): TorsoAttachment | AttachmentPoint | null {

  switch (type) {

    case 'TORSO':
      return {
        leg1: { x: width * 0.4, y: height * 0.9 },
        leg2: { x: width * 0.8, y: height * 0.9 },
        side1: { x: width * 0.25, y: height * 0.6 },
        side2: { x: width * 0.75, y: height * 0.6 },
        side3: { x: width * 0.2, y: height * 0.3 },
        side4: { x: width * 0.80, y: height * 0.3 },
        top1: { x: width * 0.25, y: height * 0.1 },
        top2: { x: width * 0.75, y: height * 0.1 },
      }
    
    case 'LEGS':
      return {
        x: width * 0.5,
        y: height * 0.1
      }
  
    case 'SIDE_WEAPON':
      return {
        x: width * 0.3,
        y: height * 0.5
      }
  
    case 'TOP_WEAPON':
      return {
        x: width * 0.3,
        y: height * 0.8
      }

    default:
      return null

  }

}


export function getNextItemID (): Item['id'] {
  
  if (itemsPackData === null) {
    throw new Error('No pack imported')
  }

  let highestID: Item['id'] = 0

  for (const item of itemsPackData.items) {
    highestID = Math.max(highestID, item.id)
  }

  return highestID + 1

}
