<script>
  import PlayerNumeric from './players/Number.svelte';
  import PlayerArray from './players/SymbolArray.svelte';

  export let context;
  export let meta;
</script>

<div class="template">
  {#each Object.entries(context) as [player, value]}
    {#if meta['players'][player]['type'] === 'number'}
      <PlayerNumeric name={player} number={value['value']} color="green" />
    {:else if meta['players'][player]['type'] === 'array' || meta['players'][player]['type'] === 'string'}
      <PlayerArray name={player} array={value['value']} />
    {:else}
      <p>{player}, {value['value']}</p>
    {/if}
  {/each}
</div>

<style>
  .template {
    /* height: 200px; */
  }
</style>
