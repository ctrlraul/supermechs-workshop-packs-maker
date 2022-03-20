import { writable } from 'svelte/store'
import type { Item } from './items/Item'



export const selectedItem = writable<Item | null>(null)
