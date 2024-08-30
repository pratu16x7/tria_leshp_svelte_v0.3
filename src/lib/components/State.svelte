<script>
  import PlayerNumeric from './players/Number.svelte';
  import PlayerArray from './players/SymbolArray.svelte';
  import { toType } from '../utils/_index';

  export let context;
  export let meta;
  export let scaleDown = false;
</script>

<div class="template" class:scale-down={scaleDown}>
  {#each Object.entries(context) as [player, playerState]}
    <!-- actually the safest way to check type here based on actual value -->
    {@const playerType = toType(playerState['value'])}
    <!-- {@const pointers = meta[player]['pointers']} -->
    <!-- {#if playerType === 'number' && !pointers.includes(player)} -->

    <div class="margin">
      {#if playerType === 'number'}
        <PlayerNumeric
          name={player}
          number={playerState['value']}
          color="green"
          active={playerState['isPlaying']}
        />
      {:else if playerType === 'array' || playerType === 'string'}
        <!-- {@const pointer_1 = meta[player]['pointer_1']} -->
        <PlayerArray
          name={player}
          array={playerState['value']}
          active={playerState['isPlaying']}
          pointerName={'j'}
          pointerValue={0}
        />
      {:else}
        <p>{player}, {playerState['value']}</p>
      {/if}
    </div>
  {/each}
</div>

<!--
pointerName={'pointer_1'}
pointerValue={context[pointer_1]['value']} -->

<style>
  .template {
    /* height: 200px; */
  }

  /* TODO: shorten width instead, this does not reduce the width of container */
  .scale-down {
    /* transform: scale(0.5); */
  }

  .margin {
    margin: 16px;
  }
</style>
