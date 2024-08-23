<!-- TODO list
- [ ] empty state symbol
- [ ] length prop
- [ ] pointers support
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
  export let pointerName = 'i';
  export let pointerValue = 0;

  const pointerPosition = tweened(0, {
    duration: 500,
    easing: cubicOut
  });

  $: pointerPosition.set(pointerValue * 32); // Assuming each box is 32px wide with margin
</script>

<div class="container" style="--opacity: {active ? '1' : '0.2'}">
  <span class="var-name">{name}</span>
  <div class="array-box">
    {#each array as element}
      <div class="element-box" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        {element}
      </div>
    {/each}
    <div class="pointer" style="left: {$pointerPosition}px"></div>
    <span class="label" style="left: {$pointerPosition + 15}px">{pointerName}</span>
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
  .element-box {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: yellow;
    border: 2px solid darkgoldenrod;
    color: black;
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
