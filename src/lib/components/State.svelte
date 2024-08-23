<script>
  import PlayerNumeric from './players/Number.svelte';
  import PlayerArray from './players/SymbolArray.svelte';
  import { toType } from '../utils/_index';

  export let context;
</script>

<div class="template">
  {#each Object.entries(context) as [player, playerState]}
    <!-- actually the safest way to check type here based on actual value -->
    {@const playerType = toType(playerState['value'])}
    {#if playerType === 'number'}
      <PlayerNumeric
        name={player}
        number={playerState['value']}
        color="green"
        active={playerState['isPlaying']}
      />
    {:else if playerType === 'array' || playerType === 'string'}
      <PlayerArray name={player} array={playerState['value']} active={playerState['isPlaying']} />
    {:else}
      <p>{player}, {playerState['value']}</p>
    {/if}
  {/each}
</div>

<style>
  .template {
    /* height: 200px; */
  }
</style>
