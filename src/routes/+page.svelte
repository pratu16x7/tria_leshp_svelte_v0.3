<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import State from '../lib/components/State.svelte';
  import { testPrograms, algorithms } from '../data/sample_program.js';
  import PlayerNumeric from '../lib/components/players/Number.svelte';
  import PlayerArray from '../lib/components/players/SymbolArray.svelte';
  import { getAST, unspoolExecute, spoolItemBase, metaBase } from '../lib/utils/ast';

  // let program = testPrograms['arrayAndPush']['text'];
  let program = algorithms['uncompress']['text'];
  $: index = 0;

  // not removing coz don't yet know how to get ... active part from ... the program text ...
  // oh wait you just need to get the spliced string with the positions
  //
  // oh ... oh wait ...
  // Didn't need the highlight for real,
  // higthlight is purely codemirror aesthetic that I'll change late anyway in the UI I'm sure
  //
  // To know the active part beeing seen by ast
  // I could have just spliced the ya know, program STRING
  // Ya know, that what we pass to acorn in the first place

  $: ast = getAST(program);
  $: astNode = ast.body;
  let meta = metaBase;
  let spool = [spoolItemBase];
  let fullSpool = [spoolItemBase];
  $: spoolUpdated = unspoolExecute(ast, spool, fullSpool, meta);
  $: ({ context, newPlayers, interactions, execLevel, nodeType, cursor } = spoolUpdated[index + 1]);

  $: currentAstNodeItem = astNode[index] || '';

  // $: console.log('Debug AST', ast);
  // $: console.log('Debug context', context);
</script>

<h1>Leshp</h1>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} />

<div class="container">
  <div class="top-row">
    <div class="box border">
      <State {context} {meta} />
      <FunctionPreview bind:program {cursor} />
    </div>
    <div class="box border">
      <h3>Spool</h3>
      <p>{JSON.stringify(meta)}</p>
      {#each spool as spoolItem, i}
        <SpoolItem {...spoolItem} active={i === index + 1} {meta} />
      {/each}
      <!-- <TempCurrentSpoolItem ast={spool} /> -->
    </div>
    <div class="box border">
      <h3>Full Spool</h3>
      {#each fullSpool as spoolItem, i}
        <p>{i}------{spoolUpdated[index + 1]['index']}</p>
        <p class:active={i === spoolUpdated[index + 1]['index']}>
          {JSON.stringify(Object.values(spoolItem))}
        </p>
      {/each}
    </div>
  </div>
  <div class="border">
    <h3>astNode Item</h3>
    <TempCurrentSpoolItem ast={JSON.stringify(meta)} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    width: 100%;
    margin: 1em;
  }
  .box {
    /* margin: 1em; */
    padding: 1em;
    flex: 1;
    overflow: scroll;
    height: 600px;
  }
  .active {
    color: orange;
  }
</style>
