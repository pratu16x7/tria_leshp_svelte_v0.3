<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import { testPrograms, algorithms } from '../data/sample_program.js';
  import { getAST, unspoolExecute, spoolItemBase, metaBase } from '../lib/utils/ast';

  let program = testPrograms['if']['text'];
  // let program = algorithms['uncompress']['text'];
  $: index = 0;

  $: ast = getAST(program);
  // $: console.log('Debug AST', ast);
  $: astNode = ast.body;

  let meta = metaBase;
  let spool = [spoolItemBase];
  let fullSpool = [spoolItemBase];
  $: spoolUpdated = unspoolExecute(ast, program, spool, fullSpool, meta);

  $: currSpoolItem = spoolUpdated[index + 1];
  $: ({ context, interactions, execLevel, nodeType, cursor, programPart } = currSpoolItem);
  // $: currLine = program.slice(cursor.start, cursor.end);

  $: currentAstNodeItem = astNode[index] || '';
</script>

<h1>Leshp</h1>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} line={programPart} />
<!-- <h1>{programPart}</h1> -->
<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program {cursor} />
      <SpoolItem {...currSpoolItem} topLevel={false} {meta} templateType="animation" />
    </div>
    <div class="box border">
      <h3>Full Spool</h3>
      {#each fullSpool as spoolItem, i}
        <SpoolItem
          {...spoolItem}
          active={i === spoolUpdated[index + 1]['index']}
          {meta}
          templateType="spool"
        />
      {/each}
    </div>
  </div>
  <div class="border">
    <h3>Meta and astNode Item</h3>
    <p>{JSON.stringify(meta)}</p>
    <TempCurrentSpoolItem ast={JSON.stringify(currentAstNodeItem)} />
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
    height: 800px; /* with page zoom at 67%*/
  }
  .active {
    color: orange;
  }
</style>
