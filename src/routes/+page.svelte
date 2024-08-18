<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import TemplateForBaseAlgo from '../lib/TemplateForBaseAlgo.svelte';
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
      <TemplateForBaseAlgo firstLine={''}>
        {#each Object.entries(context) as [player, value]}
          {#if meta['players'][player]['type'] === 'number'}
            <PlayerNumeric name={player} number={value} color="green" />
          {:else if meta['players'][player]['type'] === 'array' || meta['players'][player]['type'] === 'string'}
            <PlayerArray name={player} array={value} />
          {:else}
            <p>{player}, {value}</p>
          {/if}
        {/each}
      </TemplateForBaseAlgo>
      <FunctionPreview bind:program {cursor} />
    </div>
    <div class="box border">
      <h3>Spool</h3>
      {#each spool as spoolItem, i}
        <p class:color-active={i === index + 1}>{JSON.stringify(Object.values(spoolItem))}</p>
      {/each}
      <!-- <TempCurrentSpoolItem ast={spool} /> -->
    </div>
    <div class="box border">
      <h3>Remaining spool Item</h3>
      {#each fullSpool as spoolItem}
        <p>{JSON.stringify(Object.values(spoolItem))}</p>
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
  .color-active {
    color: orange;
  }
</style>
