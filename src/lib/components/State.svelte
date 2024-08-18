<script>
  import PlayerNumeric from './players/Number.svelte';
  import PlayerArray from './players/SymbolArray.svelte';

  export let context;
  export let meta;
</script>

<div class="template">
  {#each Object.entries(context) as [player, state]}
    {#if meta['players'][player]['type'] === 'number'}
      <PlayerNumeric
        name={player}
        number={state['value']}
        color="green"
        active={state['isUpdated']}
      />
    {:else if meta['players'][player]['type'] === 'array' || meta['players'][player]['type'] === 'string'}
      <PlayerArray name={player} array={state['value']} active={state['isUpdated']} />
    {:else}
      <p>{player}, {state['value']}</p>
    {/if}
  {/each}
</div>

<style>
  .template {
    /* height: 200px; */
  }
</style>
