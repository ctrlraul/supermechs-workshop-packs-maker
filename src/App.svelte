<script lang="ts">


import { importItemsPack } from './items/ItemsManager'
import { itemsPackData } from './itemsPackDataStore'
import ItemsListSection from './lib/ItemsListSection.svelte'
import ItemEditor from './lib/ItemEditor.svelte'
import { onMount } from 'svelte';
import { loadStatImages } from './stats/StatsManager'
import downloadJSON from './utils/downloadJSON'


import type { ItemsPackV1, RawItemV1 } from './items/importItemsPackV1'
import type { Item } from './items/Item'
import ItemCreator from './lib/ItemCreator.svelte';



// Data

$: items = $itemsPackData ? $itemsPackData.items : []
$: packFileName = $itemsPackData ? $itemsPackData.name : ''

let importing = false
let creatingItem = false
let progress = 0




// Functions

async function importFromURL (url: string | null): Promise<void> {

  if (!url) {
    return
  }

  try {

    importing = true

    const response = await fetch(url)
    const rawItemsPack = await response.json()

    $itemsPackData = await importItemsPack(rawItemsPack, value => progress = value)

  } catch (err: any) {

    alert('Failed to import pack: ' + err.message)

  } finally {

    importing = false
    progress = 0

  }

}


async function importFromFile (e: Event): Promise<void> {

  const { files } = e.target as HTMLInputElement

  if (e.target && files) {

    const file = files[0]

    try {
      await importFromURL(URL.createObjectURL(file))
      packFileName = file.name.replace(/\.[^.]+$/, '') // Remove file extension
    } catch (err: any) {
      alert('Failed to import pack: ' + err.message)
    }

  }

}


function downloadPack (): void {

  if ($itemsPackData === null) {
    return
  }

  const items: RawItemV1[] = []

  for (const item of $itemsPackData.items) {

    const rawItem = $itemsPackData.raw.items.find((raw: any) => raw.id === item.id)

    const itemToDownload: RawItemV1 = {
      id: item.id,
      name: item.name,
      element: item.element,
      image: rawItem.image,
      stats: item.stats,
      transform_range: item.transformRange,
      type: item.type,
      width: item.width,
      height: item.height,
      tags: rawItem.tags,
    }

    if (item.attachment !== null) {
      itemToDownload.attachment = item.attachment
    }

    if (item.goldPrice > 0) {
      itemToDownload.gold_price = item.goldPrice
    }

    if (item.tokensPrice > 0) {
      itemToDownload.tokens_price = item.tokensPrice
    }

    if (item.unlockLevel > 0) {
      itemToDownload.unlock_level = item.unlockLevel
    }

    items.push(itemToDownload)

  }

  const pack: ItemsPackV1 = {
    config: {
      base_url: $itemsPackData.raw.config.base_url,
      description: $itemsPackData.description,
      name: $itemsPackData.name,
      key: $itemsPackData.key,
    },
    items
  }

  downloadJSON(pack, packFileName || $itemsPackData.name)

}


function createItem (item: Item): void {
  creatingItem = false
}


onMount(() => loadStatImages())

</script>



<main>
  
  {#if $itemsPackData === null}

    <div class="import-buttons">

      <button on:click={() => importFromURL(prompt('Items Pack URL'))}>
        Import From URL
      </button>

      <button>
        Import From File
        <input type="file" on:change={importFromFile}/>
      </button>

    </div>

  {:else}

    <div class="pack-data-container">

      <div class="info">

        <div class="fields">

          <section>
            <h1>Key (Workshop uses it to identify your pack, must be an unique value!)</h1>
            <input type="text" bind:value={$itemsPackData.key}>
          </section>

          <section>
            <h1>Name</h1>
            <input type="text" bind:value={$itemsPackData.name}>
          </section>
  
          <section>
            <h1>Description</h1>
            <textarea bind:value={$itemsPackData.description} rows="3" />
          </section>

        </div>

        <div class="control-buttons">

          <button on:click={downloadPack}>Download Pack</button>

          <button>View JSON (soon)</button>

          <!-- <button on:click={() => creatingItem = true}>Create Item</button> -->

        </div>

      </div>

      <div class="items">

        <ItemsListSection {items} title="Torsos" type="TORSO" />
        <ItemsListSection {items} title="Legs" type="LEGS" />
        <ItemsListSection {items} title="Side Weapons" type="SIDE_WEAPON" />
        <ItemsListSection {items} title="Top Weapons" type="TOP_WEAPON" />
        <ItemsListSection {items} title="Drones" type="DRONE" />
        <ItemsListSection {items} title="Charge Engines" type="CHARGE_ENGINE" />
        <ItemsListSection {items} title="Teleporters" type="TELEPORTER" />
        <ItemsListSection {items} title="Grappling Hooks" type="GRAPPLING_HOOK" />
        <ItemsListSection {items} title="Modules" type="MODULE" />

      </div>

    </div>

  {/if}



  {#if importing}
    <div class="popup">
      Please wait... ({(progress * 100).toFixed(1)}%)
    </div>
  {/if}


  {#if creatingItem}
    <ItemCreator {createItem} />
  {/if}


  <ItemEditor />

</main>



<style>

main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2em 0;
}


.import-buttons {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  width: 100%;
  height: 100%;
}

.import-buttons > button {
  width: 16em;
  height: 2.6em;
}

.import-buttons > button > input[type=file] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  opacity: 0;
  cursor: inherit;
}


.popup {
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


.pack-data-container {
  position: relative;
  display: block;
  width: 90%;
  max-width: 76.25em;
}

.info {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 10em;
  margin-bottom: 2em;
}

.info h1 {
  margin-bottom: 0.5em;
}

.info input[type=text],
.info textarea {
  width: 100%;
  max-width: 100%;
}

.info,
.items {
  gap: 2em;
  width: 100%;
  padding: 1em;
  background-color: var(--color-darkscreen);
  border-radius: var(--ui-radius);
}

.control-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.control-buttons button {
  width: 100%;
  height: 2em;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 1em;
  overflow: hidden;
}

.items {
  display: flex;
  flex-direction: column;
}

</style>
