<!-- TODO list
- [x] empty state symbol
- [ ] length (hideable)
- [ ] indexes (hideable)
- [ ] 1 pointer support
- [ ] 2 pointer support
- [ ] substring support (color, block ... whatever)
- [ ] ...
-->
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import Number from './Number.svelte';

  export let name = ''; // Variable name
  export let array: Number[] | string; // Array of numbers
  export let active = true; // Active state control
  export let pointerNames;
  export let pointerValues = [0];

  export let fontSize = 24;

  $: width = (fontSize * 2) / 3;
  $: quoteOffset = width;

  const pointerPosition = tweened(0, {
    duration: 500,
    easing: cubicOut
  });

  $: pointerPosition.set(pointerValues[0] * (fontSize + 2));
</script>

<div class="container" style="--opacity: {active ? '1' : '0.2'}">
  <span class="var-name">{name}</span>
  <div class="array-box">
    <div class="symbol" style="width: {width}px; height: {fontSize}px; font-size: {fontSize}px;">
      {'❝'}
    </div>
    {#each array as element}
      <div
        class="symbol"
        style="width: {width}px; height: {fontSize}px; font-size: {fontSize}px;"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 300 }}
      >
        {element}
      </div>
    {/each}
    {#if pointerNames.length > 0}
      <div class="symbol" style="width: {width}px; height: {fontSize}px; font-size: {fontSize}px;">
        {'”'}
      </div>
      <div class="pointer" style="left: {quoteOffset - 3 + $pointerPosition}px"></div>
      <span class="label" style="left: {quoteOffset + $pointerPosition + fontSize / 2}px"
        >{pointerNames[0]}</span
      >
    {/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    opacity: var(--opacity);
  }
  .array-box {
    position: relative; /* For absolute positioning of the pointer */
    display: flex;
    margin-left: 8px; /* Space between name and array */
  }
  .symbol {
    color: rgb(53, 53, 53);
  }
  .var-name {
    font-size: 14px;
    color: black;
  }
  .pointer {
    position: absolute;
    bottom: 100%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid black; /* Creates an arrow pointing down */
  }
  .label {
    position: absolute;
    bottom: 100%;
    transform: translateX(-50%);
    white-space: nowrap; /* Keeps the label text in a single line */
  }
</style>
