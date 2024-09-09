<script>
  import PlayerNumeric from './players/Number.svelte';
  import PlayerArray from './players/SymbolArray.svelte';
  import { toType } from '../utils/_index';

  export let context;
  export let meta;
  export let scaleDown = false;
  export let hide = false;
</script>

<div class="state-box" class:scale-down={scaleDown} class:hide>
  {#each Object.entries(context) as [player, playerState]}
    <!-- actually the safest way to check type here based on actual value -->
    {@const playerType = toType(playerState['value'])}
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
        <!-- {@const pointers = meta.pointersForLists[player]}
        {@const pointer_1 = pointers[0]} -->
        <!-- {console.log('==========pointers', pointers, pointer_1, meta)} -->
        <PlayerArray name={player} array={playerState['value']} active={playerState['isPlaying']} />
      {:else}
        <p>{player}, {playerState['value']}</p>
      {/if}
    </div>
  {/each}
</div>

<!--
          pointerName={pointer_1}
          pointerValue={context[pointer_1]['value']}
pointerName={'pointer_1'}
pointerValue={context[pointer_1]['value']} -->

<style lang="scss">
  .state-box {
    // height: 400px;
    // background-color: aqua;
  }

  // :global(.animation) {
  //   position: relative;
  //   .state-box {
  //     position: absolute;
  //   }
  // }
  /* TODO: shorten width instead, this does not reduce the width of container */
  .scale-down {
    // transform: scale(0.5);
  }

  .margin {
    margin: 16px;
  }
</style>
