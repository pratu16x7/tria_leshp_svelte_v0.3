<script>
  import State from './State.svelte';

  export let nodeType;
  export let execLevel;
  export let context;
  export let newPlayers;
  export let interactions;
  export let literalValue;
  export let meta;
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

<div class="border" class:active>
  <h3>{nodeType} : {execLevel}</h3>

  <State {context} {meta} />
  <State context={newPlayers} {meta} />
  <p>{JSON.stringify(literalValue)} __ {JSON.stringify(interactions)}</p>

  <p>{JSON.stringify(context)}</p>
  <p>{JSON.stringify(newPlayers)}</p>
</div>

<style>
  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }
  .active {
    background-color: lightpink;
  }
</style>
