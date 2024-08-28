<script>
  import State from './State.svelte';
  import LoopWrapper from './LoopWrapper.svelte';

  export let _id;
  export let activeId;
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
  export let parentBreadcrumbs;
  // export let cursor;  // Already used in program code editor to highlight
  export let anim;
  export let templateType;

  export let children = [];

  let parent = 'test';
  // console.log('========', parentBreadcrumbs);
</script>

{#if templateType === 'animation'}
  <h4>id {_id}</h4>
  {#if parentBreadcrumbs.length}
    <div class="border {parent}">
      <!-- <p>
        {JSON.stringify(loopAndBlocks.testAndBlocks[0]['name'])}: {loopAndBlocks.testAndBlocks[0]['parent']}
      </p> -->

      <div class="anchor">
        <LoopWrapper wrappers={parentBreadcrumbs} />
        <div class="absolute">
          <h4>{cursor.programPart}</h4>
          <State {context} {meta} />
        </div>
      </div>
    </div>
  {:else}
    <h4>{cursor.programPart}</h4>
    <State {context} {meta} />
  {/if}
{:else if templateType === 'spool'}
  <div
    class="border default-node"
    class:active={_id === activeId}
    class:anim
    class:loop={loopAndBlocks.testAndBlocks.length > 0}
    class:test={testAndBlock.block.children.length > 0}
  >
    <h4>id {_id}</h4>
    <h4>{nodeType} : {cursor.programPart}</h4>
    <State {context} {meta} />
    <p>{JSON.stringify(parentBreadcrumbs)}</p>

    {#if loopAndBlocks.testAndBlocks.length}
      <h3>Loop (WIP color coding spool Items)</h3>
      {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
        <h3>Loop {i + 1} test</h3>
        <svelte:self {...testAndBlock.test} templateType="spool" {meta} {activeId} />
        <h3>exec</h3>
        {#each testAndBlock.block.children as spoolItem, i}
          <svelte:self {...spoolItem} templateType="spool" {meta} {activeId} />
        {/each}
      {/each}
    {:else if testAndBlock.block.children.length}
      <svelte:self {...testAndBlock.test} templateType="spool" {meta} {activeId} />
      <h3>Test</h3>
      {#each testAndBlock.block.children as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} {activeId} />
      {/each}
    {:else if nodeType === 'Program' && children.length}
      {#each children as spoolItem, i}
        <svelte:self {...spoolItem} templateType="spool" {meta} {activeId} />
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
    margin: 1em;
    margin-left: 3em;
  }

  .top-level {
    background-color: rgb(220, 231, 243);
  }

  .anim {
    background-color: lightpink;
  }

  .default-node {
    background-color: #fff;
  }

  .current {
    background-color: #fff;
  }

  .test {
    background-color: lightcyan;
  }
  .loop {
    background-color: lightgoldenrodyellow;
  }

  .active {
    background-color: greenyellow;
  }
</style>
