<script lang="ts">

import ItemButton from './ItemButton.svelte'
import { selectedItem } from '../selectedItemStore'
import type { Item } from '../items/Item'



export let items: Item[]
export let type: Item['type']
export let title: string

</script>



<section>
  <h1>{title}</h1>
  <ul class="items-list">
    {#each items.filter(item => item.type === type) as item}
      <ItemButton item={item} on:click={() => $selectedItem = item} />
    {/each}
  </ul>
</section>



<style>

h1 {
  margin-bottom: 0.5em;
}

.items-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  background-color: var(--color-background);
  border-radius: var(--ui-radius);
  padding-bottom: 0.5em;
}

</style>