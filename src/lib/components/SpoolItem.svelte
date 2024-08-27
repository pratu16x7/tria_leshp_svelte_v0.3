<script>
  import State from './State.svelte';
  import LoopWrapper from './LoopWrapper.svelte';

  export let nodeType;
  export let execLevel;
  export let context;
  export let testChildren = [];
  export let blockChildren = [];
  export let loopChildren = [];
  export let meta;
  export let cursor;
  export let modeBlocks;
  // export let cursor;  // Already used in program code editor to highlight
  export let active = false;
  export let levels;
  export let templateType;

  export let topLevel = levels.topLevel;
</script>

{#if templateType === 'animation'}
  {#if modeBlocks.blocksSoFar.length}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}" class:top-level={topLevel}>
      <p>
        {JSON.stringify(modeBlocks.blocksSoFar[0]['name'])}: {modeBlocks.blocksSoFar[0]['parent']}
      </p>

      <div class="anchor">
        <LoopWrapper wrappers={modeBlocks.blocksSoFar} />
        <div class="absolute">
          <h4>{execLevel} : {cursor.programPart}</h4>
          <State {context} {meta} />
        </div>
      </div>
    </div>
  {:else}
    <h4>{execLevel} : {cursor.programPart}</h4>
    <State {context} {meta} />
  {/if}
{:else if templateType === 'spool'}
  <div class="border" class:active class:anim={levels.anim} class:top-level={topLevel}>
    <h4>{nodeType} : {execLevel} : {cursor.programPart}</h4>
    <State {context} {meta} />
    <p>{JSON.stringify(modeBlocks)}</p>

    {#if loopChildren.length}
      <h3>Loop (WIP color coding spool Items)</h3>
      {#if testChildren.length}
        <h3>Tests first</h3>
      {/if}
      {#each testChildren as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} />
      {/each}
      {#each loopChildren as children, i}
        <h3>Loop {i} exec</h3>
        {#each children as spoolItem, i}
          <svelte:self {...spoolItem} templateType="spool" {meta} />
        {/each}
      {/each}
    {:else}
      {#if testChildren.length}
        <h3>Test</h3>
      {/if}
      {#each testChildren as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} />
      {/each}
      {#if blockChildren.length}
        <h3>Block</h3>
      {/if}
      {#each blockChildren as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} />
      {/each}
    {/if}
    <!-- <p>{JSON.stringify(testChildren)} __ {JSON.stringify(blockChildren)}</p> -->
    <!-- <p>{JSON.stringify(context)}</p> -->
  </div>
{/if}

<style>
  .anchor {
    position: relative;
  }

  .absolute {
    top: 0;
    position: absolute;
  }

  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }

  .top-level {
    background-color: rgb(220, 231, 243);
  }

  .current {
    background-color: #fff;
  }

  .test {
    background-color: lightgoldenrodyellow;
  }

  .anim {
    background-color: lightpink;
  }

  .active {
    background-color: greenyellow;
  }
</style>
