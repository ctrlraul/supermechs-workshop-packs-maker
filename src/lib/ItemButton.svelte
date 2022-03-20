<script lang="ts">

import { renderItem } from '../items/ItemsManager'
import type { Item } from '../items/Item'


export let item: Item


let canvas: HTMLCanvasElement | null = null


$: {
  if (canvas !== null) {

    let width = 100
    let height = 100

    if (item.width > item.height) {
      height = item.height / item.width * 100
    } else {
      width = item.width / item.height * 100
    }

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')!
    renderItem(
      ctx,
      item,
      0,
      0,
      width,
      height
    )
  }
}

</script>



<button on:click>
  <div class="wrapper">
    <canvas bind:this={canvas}></canvas>
  </div>
</button>



<style>

button {
  --size: calc(7.09% - 0.5em);
  position: relative;
  display: block;
  width: var(--size);
  /* width: 6%; */
  border: none;
  height: 0;
  padding-top: var(--size);
  margin-left: 0.5em;
  margin-top: 0.5em;
  cursor: pointer;
}

.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  left: 5%;
  top: 5%;
  width: 90%;
  height: 90%;
  object-fit: contain;
}

@media (max-width: 800px) {
  button {
    --size: calc(9.9% - 0.5em);
  }
}

@media (max-width: 500px) {
  button {
    --size: calc(14% - 0.5em);
  }
}

</style>