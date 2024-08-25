<script lang="ts">
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import { getAST, unspoolExecute } from '../lib/utils/ast';
  import { spoolItemBase } from './utils/what-we-support';

  export let program: string;
  $: index = 0;

  $: ast = getAST(program);
  $: astNode = ast.body;

  $: fullSpool = unspoolExecute(ast, program);

  $: spoolAnim = fullSpool.filter((s) => s.anim === true);
  console.log('program', program);
  console.log('spoolAnim', spoolAnim); // why is this undefined here and not later??
  console.log('fullSpool', fullSpool);

  $: currSpoolItem = spoolAnim[index];
  $: ({ context, interactions, execLevel, nodeType, cursor, programPart } = currSpoolItem);
  // $: currLine = program.slice(cursor.start, cursor.end);

  let meta = {
    l: {
      pointer_1: 'j'
    }
    // type: symbol array/string or numeric problem?
    // on second thoughr, just assume symbol array is a string

    // substring? -> assume yes is symbol array/string and two pointers?
    // 1 substring and 1 value At? -> mayve let this be default
    // two substrings?
  };

  $: currentAstNodeItem = astNode[index] || '';
</script>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} line={programPart} />
<!-- <h1>{programPart}</h1> -->
<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program {cursor} />
      <SpoolItem {...currSpoolItem} topLevel={false} templateType="animation" {meta} />
    </div>
    <div class="box border">
      <h3>Full Spool</h3>
      group first, you'll have to form a json tree structure again sadly recursively keep rendering any
      children nodes but you'll still have to keep the linear order for the animation above so just simply
      update the current spool with the depth first node
      {#each fullSpool as spoolItem, i}
        <SpoolItem
          {...spoolItem}
          active={spoolItem._id === currSpoolItem._id}
          templateType="spool"
          {meta}
        />
      {/each}
    </div>
  </div>
  <div class="border">
    <h3>astNode Item</h3>
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
    height: 500px; /* with page zoom at 67%*/
  }
  .active {
    color: orange;
  }
</style>
