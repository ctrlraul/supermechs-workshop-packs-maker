<script lang="ts">

import { selectedItem } from '../selectedItemStore'
import { getAllStatInstructions, getStatInstruction } from '../stats/StatsManager'
import { getTypedKeys } from '../utils/getTypedKeys'
import StatsMaker from './StatsMaker.svelte'



// Types

import type { Item } from '../items/Item'



// Data

$: console.log('Editing item:', $selectedItem)
$: statConfigs = $selectedItem ? getTypedKeys($selectedItem.stats).map(getStatInstruction) : []
$: statConfigsToAdd = getAllStatInstructions().filter(config => !statConfigs.includes(config))

const itemElements: Item['element'][] = ['PHYSICAL', 'EXPLOSIVE', 'ELECTRIC', 'COMBINED']

let makingStat = false

// const itemTypes: Item['type'][] = [
//   'TORSO', 'LEGS', 'SIDE_WEAPON', 'TOP_WEAPON', 'DRONE',
//   'CHARGE_ENGINE', 'TELEPORTER', 'GRAPPLING_HOOK', 'MODULE'
// ]



// Functions

function onClickOut (e: MouseEvent): void {
  if (e.target === e.currentTarget) {
    $selectedItem = null
  }
}


function toFriendlyText (text: string): string {
  return (text[0].toUpperCase() + text.slice(1).toLowerCase()).replace(/_/g, ' ')
}


function deleteStat (key: string): void {
  if ($selectedItem) {
    delete $selectedItem.stats[key as keyof Item['stats']]
    $selectedItem = $selectedItem
  }
}


function onMakeStat (key: keyof Item['stats'], value: number & [number, number]): void {
  if ($selectedItem) {
    makingStat = false
    $selectedItem.stats[key] = value
  }
}

</script>



{#if $selectedItem !== null}
  <div class="item-editor" on:click={onClickOut}>
    
    <div class="meta">

      <section>
        <h1>Name</h1>
        <input type="text" bind:value={$selectedItem.name}>
      </section>
      
      <section>
        <h1>Element</h1>
        <select bind:value={$selectedItem.element}>
          {#each itemElements as element}
            <option value={element}>{toFriendlyText(element)}</option>
          {/each}
        </select>
      </section>
      
      <section>
        <h1>Stats</h1>
        <ul class="stat-blocks">
          {#each Object.entries($selectedItem.stats) as [key, value], i}
        
            {#if Array.isArray(value)}

              <li title={statConfigs[i].name}>

                <button on:click={() => deleteStat(key)}>x</button>

                <img src={statConfigs[i].imageURL} alt={statConfigs[i].name}>

                <input type="number" value={value[0]} on:change={e => {
                    // @ts-ignore
                    const stat = $selectedItem.stats[key]
                    // @ts-ignore
                    $selectedItem.stats[key] = [Number(e.target.value), stat[1]]
                }}>
                -
                <input type="number" value={value[1]} on:change={e => {
                  // @ts-ignore
                  const stat = $selectedItem.stats[key]
                  // @ts-ignore
                  $selectedItem.stats[key] = [stat[0], Number(e.target.value)]
                }}>
              </li>

            {:else}

              <li title={statConfigs[i].name}>
                <button on:click={() => deleteStat(key)}>x</button>
                <img src={statConfigs[i].imageURL} alt={statConfigs[i].name}>
                <input type="number" value={value} on:change={e => {
                  // @ts-ignore
                  $selectedItem.stats[key] = Number(e.target.value)
                }}>
              </li>

            {/if}

          {/each}

        </ul>

        {#if statConfigsToAdd.length}
          <button class="add-stat-button" on:click={() => makingStat = true}>+ Add Stat</button>
        {/if}

      </section>

    </div>

    {#if makingStat}
      <StatsMaker {onMakeStat} options={statConfigsToAdd} />
    {/if}

  </div>
{/if}



<style>

.item-editor {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-darkscreen);
}


.meta {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding: 1em;
  border-radius: var(--ui-radius);
  background-color: var(--color-background);
}

h1 {
  margin-bottom: 0.5em;
}

.stat-blocks {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  list-style: none;
}

.stat-blocks li {
  display: flex;
  align-items: center;
  gap: 0.5em;
  width: 15em;
}

.stat-blocks button {
  width: 1.5em;
  height: 1.5em;
}

.stat-blocks input[type=number] {
 flex: 1;
 width: 100%;
}

.stat-blocks img {
  width: 1.5em;
  height: 1.5em;
}

.add-stat-button {
  margin-top: 0.5em;
  width: 100%;
  height: 2em;
}

</style>
