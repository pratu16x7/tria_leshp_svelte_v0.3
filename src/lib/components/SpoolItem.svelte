<script>
  import State from './State.svelte';

  export let activeId;
  export let activeParentBreadcrumbs;

  export let _id;
  export let execLevel;
  export let parentBreadcrumbs;

  export let nodeType;
  export let cursor;
  export let context;

  export let testAndBlock = {
    test: {},
    block: { children: [] }
  };
  export let loopAndBlocks = {
    testAndBlocks: []
  };
  export let children = [];

  export let meta;
  export let templateType;
</script>

<div
  class="border default-node"
  class:hide={templateType === 'animation' && !activeParentBreadcrumbs.includes(_id)}
  class:active={templateType === 'spool' && _id === activeId}
  class:loop={loopAndBlocks.testAndBlocks.length > 0}
  class:test={testAndBlock.block.children.length > 0}
>
  <p class="tiny">{JSON.stringify(parentBreadcrumbs)} : {nodeType}: {cursor.programPart}</p>
  <State {context} {meta} />

  {#if loopAndBlocks.testAndBlocks.length}
    <h3>Loop (WIP color coding spool Items)</h3>

    <!--  -->
    {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
      <h3>Loop {i + 1} test</h3>
      <svelte:self
        {...testAndBlock.test}
        {templateType}
        {meta}
        {activeId}
        {activeParentBreadcrumbs}
      />

      <!--  -->
      <h3>exec</h3>
      {#each testAndBlock.block.children as spoolItem, i}
        <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
      {/each}
    {/each}

    <!--  -->
  {:else if testAndBlock.block.children.length}
    <svelte:self
      {...testAndBlock.test}
      {templateType}
      {meta}
      {activeId}
      {activeParentBreadcrumbs}
    />

    <!--  -->
    <h3>Test</h3>
    {#each testAndBlock.block.children as spoolItem, i}
      <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
    {/each}

    <!--  -->
  {:else if nodeType === 'Program' && children.length}
    {#each children as spoolItem, i}
      <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
    {/each}
  {/if}
</div>

<style>
  .anchor {
    position: relative;
  }

  .hide {
    display: none;
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

  .default-node {
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

  .tiny {
    font-size: 0.5rem;
  }
</style>
