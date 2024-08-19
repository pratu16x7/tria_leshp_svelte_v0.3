<script>
  import State from './State.svelte';

  export let nodeType;
  export let execLevel;
  export let context;
  export let interactions;
  export let literalValue;
  export let meta;
  export let programPart;
  export let topLevel;
  // export let cursor;  // Already used in program code editor to highlight
  export let active;
</script>

<!-- export const spoolItemBase = {
	nodeType: '',
	execLevel: 0,
	context: {},
	newPlayers: {},
	interactions: {},
	literalValue: [],
	cursor: {}
  }; -->

<div class="border" class:active class:top-level={topLevel}>
  <h4>{nodeType} : {execLevel} : {programPart}</h4>
  <State {context} {meta} />
  <p>{JSON.stringify(literalValue)} __ {JSON.stringify(interactions)}</p>
  <!-- <p>{JSON.stringify(context)}</p> -->
</div>

<style>
  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }
  .top-level {
    background-color: rgb(220, 231, 243);
  }

  .active {
    background-color: lightpink;
  }
</style>
