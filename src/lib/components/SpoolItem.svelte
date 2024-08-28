<script>
  import State from './State.svelte';
  import LoopWrapper from './LoopWrapper.svelte';

  export let nodeType;
  export let execLevel;
  export let context;
  export let testAndBlock = {
    test: {},
    block: { children: [] }
  };

  export let loopAndBlocks = {
    testAndBlocks: []
  };

  export let meta;
  export let cursor;
  export let modeBlocks;
  // export let cursor;  // Already used in program code editor to highlight
  export let active = false;
  export let levels;
  export let templateType;

  export let children = [];
</script>

{#if templateType === 'animation'}
  {#if modeBlocks.blocksSoFar.length}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}">
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
  <div class="border" class:active class:anim={levels.anim}>
    <h4>{nodeType} : {execLevel} : {cursor.programPart}</h4>
    <State {context} {meta} />
    <p>{JSON.stringify(modeBlocks)}</p>

    {#if loopAndBlocks.testAndBlocks.length}
      <h3>Loop (WIP color coding spool Items)</h3>
      {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
        <h3>Loop {i + 1} test</h3>
        <svelte:self {...testAndBlock.test} templateType="spool" {meta} />
        <h3>exec</h3>
        {#each testAndBlock.block.children as spoolItem, i}
          <svelte:self {...spoolItem} templateType="spool" {meta} />
        {/each}
      {/each}
    {:else if testAndBlock.block.children.length}
      <svelte:self {...testAndBlock.test} templateType="spool" {meta} />
      <h3>Test</h3>
      {#each testAndBlock.block.children as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} />
      {/each}
    {:else if nodeType === 'Program' && children.length}
      {#each children as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} />
      {/each}
    {/if}
    <!-- <p>{JSON.stringify(testAndBlock)} __ {JSON.stringify(blockChildren)}</p> -->
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
