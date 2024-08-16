<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import TemplateForBaseAlgo from '../lib/TemplateForBaseAlgo.svelte';
  import { sampleProgram2 } from '../data/sample_program.js';
  import PlayerNumeric from '../lib/components/PlayerNumeric.svelte';
  import PlayerArray from '../lib/components/PlayerArray.svelte';
  import { getAST, unspoolExecute, spoolItemBase, metaBase } from '../lib/utils/ast';

  let program = sampleProgram2;
  $: index = 0;

  $: lines = program.split('\n');

  $: ast = getAST(program);
  $: astNode = ast.body;
  let meta = metaBase;
  let spool = [spoolItemBase];
  let fullSpool = [spoolItemBase];
  $: spoolUpdated = unspoolExecute(ast, spool, fullSpool, meta);
  $: ({ context, newPlayers, interactions, execLevel, nodeType } = spoolUpdated[index + 1]);

  $: currentAstNodeItem = astNode[index] || '';
  $: currentLine = lines[index] || '';

  // $: console.log('Debug AST', ast);
  // $: console.log('Debug context', context);
</script>

<h1>Leshp</h1>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} />

<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program />
    </div>
    <div class="box border">
      <h3>spool Item</h3>
      <TempCurrentSpoolItem ast={JSON.stringify(spoolUpdated[index + 1])} />
    </div>
    <div class="box border">
      <h3>Spool</h3>
      {#each spool as spoolItem}
        <p>{JSON.stringify(Object.values(spoolItem))}</p>
      {/each}
      <!-- <TempCurrentSpoolItem ast={spool} /> -->
    </div>
    <div class="box border">
      <h3>astNode Item</h3>
      <TempCurrentSpoolItem ast={JSON.stringify(meta)} />
    </div>
  </div>
  <div class="border">
    <TemplateForBaseAlgo firstLine={currentLine}>
      {#each Object.entries(context) as [player, value]}
        {#if meta['players'][player]['type'] === 'number'}
          <PlayerNumeric name={player} number={value} color="green" />
        {:else if meta['players'][player]['type'] === 'array'}
          <PlayerArray name={player} array={value} />
        {:else}
          <p>{player}, {value}</p>
        {/if}
      {/each}
    </TemplateForBaseAlgo>
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
    height: 200px;
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
  }
</style>
