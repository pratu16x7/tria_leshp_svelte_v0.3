<script>
  import State from './State.svelte';

  // Broadcasted to every child
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

<!-- Furled: same as spool, hiding anything other than parents. Hence, no need of active node -->
{#if templateType === 'animation'}
  <div
    class="border default-node {templateType}"
    class:hide={templateType === 'animation' && !activeParentBreadcrumbs.includes(_id)}
    class:active={templateType === 'tree' && _id === activeId}
    class:loop={loopAndBlocks.testAndBlocks.length > 0}
    class:test={testAndBlock.block.children.length > 0}
  >
    <p class="tiny">{JSON.stringify(parentBreadcrumbs)} : {nodeType}: {cursor.programPart}</p>

    <!-- This should only be one instance across the entire tree-->

    <!--  -->
    {#each children as spoolItem, i}
      <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
    {/each}

    <!--  -->
    {#if loopAndBlocks.testAndBlocks.length}
      <h3>Loop (WIP color coding spool Items)</h3>

      {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
        <h3>Loop {i + 1} test</h3>
        <svelte:self
          {...testAndBlock.test}
          {templateType}
          {meta}
          {activeId}
          {activeParentBreadcrumbs}
        />

        <h3>exec</h3>
        {#each testAndBlock.block.children as spoolItem}
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
      <h3>Test</h3>
      {#each testAndBlock.block.children as spoolItem}
        <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
      {/each}
    {/if}
  </div>

  <!--  Unfurled but TREE: a bit different, needs Flex node-container and core(fixed-width) + children (flexible-width) dichotomy. And of course, no hiding and active node indication-->
{:else if templateType === 'tree'}
  <div class="node-container">
    <div
      class="fixed-width border default-node {templateType}"
      class:hide={templateType === 'animation' && !activeParentBreadcrumbs.includes(_id)}
      class:active={templateType === 'tree' && _id === activeId}
      class:loop={loopAndBlocks.testAndBlocks.length > 0}
      class:test={testAndBlock.block.children.length > 0}
    >
      <p class="tiny">{JSON.stringify(parentBreadcrumbs)} : {nodeType}: {cursor.programPart}</p>
      <State {context} {meta} />
    </div>
    <div class="flexible-width">
      <!--  -->
      {#each children as spoolItem, i}
        <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
      {/each}

      <!--  -->
      {#if loopAndBlocks.testAndBlocks.length}
        <h3>Loop (WIP color coding spool Items)</h3>

        {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
          <h3>Loop {i + 1} test</h3>
          <svelte:self
            {...testAndBlock.test}
            {templateType}
            {meta}
            {activeId}
            {activeParentBreadcrumbs}
          />

          <h3>exec</h3>
          {#each testAndBlock.block.children as spoolItem}
            <svelte:self
              {...spoolItem}
              {templateType}
              {meta}
              {activeId}
              {activeParentBreadcrumbs}
            />
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
        <h3>Test</h3>
        {#each testAndBlock.block.children as spoolItem}
          <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
        {/each}
      {/if}
    </div>
  </div>

  <!--  Unfurled but Minimap-Tree: a bit different, needs Flex node-container and core(fixed-width) + children (flexible-width) dichotomy. And of course, no hiding and active node indication-->
{:else if templateType === 'tree-minimap'}
  <div class="node-container {templateType}">
    <div
      class="fixed-width border default-node"
      class:hide={templateType === 'animation' && !activeParentBreadcrumbs.includes(_id)}
      class:active={templateType !== 'animation' && _id === activeId}
      class:loop={loopAndBlocks.testAndBlocks.length > 0}
      class:test={testAndBlock.block.children.length > 0}
    ></div>
    <div class="flexible-width">
      <!--  -->
      {#each children as spoolItem, i}
        <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
      {/each}

      <!--  -->
      {#if loopAndBlocks.testAndBlocks.length}
        {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
          <p>Loop {i + 1} test</p>
          <svelte:self
            {...testAndBlock.test}
            {templateType}
            {meta}
            {activeId}
            {activeParentBreadcrumbs}
          />

          {#each testAndBlock.block.children as spoolItem}
            <svelte:self
              {...spoolItem}
              {templateType}
              {meta}
              {activeId}
              {activeParentBreadcrumbs}
            />
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
        <p>Test</p>
        {#each testAndBlock.block.children as spoolItem}
          <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
        {/each}
      {/if}
    </div>
  </div>

  <!-- Unfurled: same as animation, but not hiding ANY nodes, parents or not. Fully unfurled, Hence needs active node indicator -->
{:else if templateType === 'spool'}
  <div
    class="border default-node {templateType}"
    class:hide={templateType === 'animation' && !activeParentBreadcrumbs.includes(_id)}
    class:active={templateType === 'spool' && _id === activeId}
    class:loop={loopAndBlocks.testAndBlocks.length > 0}
    class:test={testAndBlock.block.children.length > 0}
  >
    <p class="tiny">{JSON.stringify(parentBreadcrumbs)} : {nodeType}: {cursor.programPart}</p>
    <State {context} {meta} />

    <!--  -->
    {#each children as spoolItem, i}
      <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
    {/each}

    <!--  -->
    {#if loopAndBlocks.testAndBlocks.length}
      <h3>Loop (WIP color coding spool Items)</h3>

      {#each loopAndBlocks.testAndBlocks as testAndBlock, i}
        <h3>Loop {i + 1} test</h3>
        <svelte:self
          {...testAndBlock.test}
          {templateType}
          {meta}
          {activeId}
          {activeParentBreadcrumbs}
        />

        <h3>exec</h3>
        {#each testAndBlock.block.children as spoolItem}
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
      <h3>Test</h3>
      {#each testAndBlock.block.children as spoolItem}
        <svelte:self {...spoolItem} {templateType} {meta} {activeId} {activeParentBreadcrumbs} />
      {/each}
    {/if}
  </div>
{/if}

<style lang="scss">
  .node-container {
    display: flex;
    align-items: center;
    margin-left: 20px; /* Indentation for child nodes */
  }

  .fixed-width {
    width: 250px;
    flex-shrink: 0;
    /* flex-grow: 1; */

    /* aesthetic */
    background-color: #f0f0f0;
    /* padding: 10px;
    box-sizing: border-box; */
  }

  .flexible-width {
    flex-grow: 1;

    /* aesthetic */
    /* padding: 10px; */
  }

  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em;
    margin-left: 3em;
  }

  .tree-minimap {
    // LVL2: exact ratio scale down for it to be accurate when using to scroll bigger map
    .fixed-width {
      width: 50px;
      height: 20px;
    }
    .border {
      margin: 0.5em;
    }

    p {
      font-size: 0.5em;
    }
  }

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
