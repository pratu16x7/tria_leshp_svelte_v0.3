<script>
  import State from './State.svelte';
  import LoopWrapper from './LoopWrapper.svelte';

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
  export let anim = false;
  export let templateType;

  $: wrappers = Array.from({ length: modeBlocks.blocksSoFar.length }, (_, i) => 'div'); // Right place for nesting logic

  console.log('wrappers', wrappers);
</script>

{#if templateType === 'animation'}
  {#if wrappers.length}
    <div class="border {modeBlocks.blocksSoFar[0]['type']}" class:top-level={topLevel}>
      <p>
        {JSON.stringify(modeBlocks.blocksSoFar[0]['name'])}: {modeBlocks.blocksSoFar[0]['parent']}
      </p>
      <LoopWrapper class="current" {wrappers}>
        <h4>{execLevel} : {programPart}</h4>
        <State {context} {meta} />
      </LoopWrapper>
    </div>
  {:else}
    <h4>{execLevel} : {programPart}</h4>
    <State {context} {meta} />
  {/if}
{:else if templateType === 'spool'}
  <div class="border" class:active class:anim class:top-level={topLevel}>
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

  .anim {
    background-color: lightpink;
  }

  .active {
    background-color: greenyellow;
  }
</style>
