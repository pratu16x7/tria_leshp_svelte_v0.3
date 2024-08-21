<script>
  import State from './State.svelte';

  export let nodeType;
  export let execLevel;
  export let context;
  export let interactions;
  export let meta;
  export let programPart;
  export let topLevel;
  export let modeBlocks;
  // export let cursor;  // Already used in program code editor to highlight
  export let active = false;
  export let templateType;
</script>

{#if templateType === 'animation'}
  {#if modeBlocks.blocksSoFar.length === 0}
    <div class="border" class:top-level={topLevel}>
      <h4>{execLevel} : {programPart}</h4>
      <State {context} {meta} />
    </div>
  {/if}
  {#if modeBlocks.blocksSoFar.length === 1}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}" class:top-level={topLevel}>
      <p>
        {JSON.stringify(modeBlocks.blocksSoFar[0]['name'])}: {modeBlocks.blocksSoFar[0]['parent']}
      </p>
      <!-- use the parent type here once you have it, as in whose test is this, is it a loop or conditional -->
      <div class="border current">
        <h4>{execLevel} : {programPart}</h4>
        <State {context} {meta} />
      </div>
    </div>
  {/if}
  {#if modeBlocks.blocksSoFar.length === 2}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}" class:top-level={topLevel}>
      <p>
        {JSON.stringify(modeBlocks.blocksSoFar[0]['name'])}: {modeBlocks.blocksSoFar[0]['parent']}
      </p>
      <!-- use the parent type here once you have it, as in whose test is this, is it a loop or conditional -->
      <div class="border current">
        <div class="border current">
          <h4>{execLevel} : {programPart}</h4>
          <State {context} {meta} />
        </div>
      </div>
    </div>
  {/if}
  {#if modeBlocks.blocksSoFar.length === 3}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}" class:top-level={topLevel}>
      <p>
        {JSON.stringify(modeBlocks.blocksSoFar[0]['name'])}: {modeBlocks.blocksSoFar[0]['parent']}
      </p>
      <!-- use the parent type here once you have it, as in whose test is this, is it a loop or conditional -->
      <div class="border current">
        <div class="border current">
          <div class="border current">
            <h4>{execLevel} : {programPart}</h4>
            <State {context} {meta} />
          </div>
        </div>
      </div>
    </div>{/if}
{:else if templateType === 'spool'}
  <div class="border" class:active class:top-level={topLevel}>
    <h4>{nodeType} : {execLevel} : {programPart}</h4>
    <State {context} {meta} />
    <p>{JSON.stringify(modeBlocks)} __ {JSON.stringify(interactions)}</p>
    <!-- <p>{JSON.stringify(context)}</p> -->
  </div>
{/if}

<style>
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

  .active {
    background-color: lightpink;
  }
</style>
