<!-- TODO list
- [ ] empty state symbol
- [ ] length prop
- [ ] pointers support
- [ ] substring support (color, block ... whatever)
- [ ] ...
-->

<script lang="ts">
  import Number from './Number.svelte';

  export let name = ''; // Variable name
  export let array: Number[] | string; // Array of numbers
  export let active = true; // Active state control
</script>

<div class="container" style="--opacity: {active ? '1' : '0.2'}">
  <span class="var-name">{name}</span>
  <div class="array-box">
    {#each array as element}
      <div class="element-box">
        {element}
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    opacity: var(--opacity);
  }
  .array-box {
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
</style>
