<script lang="ts">

import * as StatsManager from '../stats/StatsManager'

import type { Item } from '../items/Item'



export let onMakeStat: <K extends keyof Item['stats']> (key: K, value: number & [number, number]) => void
export let options: StatsManager.StatInstructionWithImage[]



// Data

let statConfig: StatsManager.StatInstructionWithImage = options[0]
let firstValue: number = 0
let secondValue: number = 0



// Functions

function onChangeStat (e: Event & { currentTarget: HTMLSelectElement }): void {
  statConfig = StatsManager.getStatInstruction(e.currentTarget.value as keyof Item['stats'])
}


function makeStat (): void {
  const value = (statConfig.type === 'number' ? firstValue : [firstValue, secondValue]) as number & [number, number]
  onMakeStat(statConfig.key, value)
}

</script>



<div class="global-darkscreen">

  <div class="global-tab-content">

    <select on:change={onChangeStat}>
      {#each options as config}
        <option value={config.key}>{config.name}</option>
      {/each}
    </select>
  
    <div class="value {statConfig.type === 'number' ? 'number' : ''}" title={statConfig.name}>
  
      <img src={statConfig.imageURL} alt={statConfig.name}>

      <input type="number" bind:value={firstValue}>
      <span>-</span>
      <input type="number" bind:value={secondValue}>

    </div>
  
    <button class="add-button" on:click={makeStat}>Add</button>

  </div>

</div>



<style>

.global-tab-content {
  width: 20em;
}

.value {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.value input {
  width: 7em;
}

.value.number input {
  width: unset;
  flex: 1;
}

.value.number span,
.value.number input:last-of-type {
  display: none;
}

img {
  width: 2em;
  height: 2em;
}

.add-button {
  height: 2em;
}

</style>