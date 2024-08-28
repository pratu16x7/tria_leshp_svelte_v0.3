<script lang="ts">
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import { getAST, unspoolExecute } from '../lib/utils/ast';

  export let program: string;
  $: index = 0;

  $: ast = getAST(program);
  $: [justtheone, nodeEvalList] = unspoolExecute(ast, program);
  $: currSpoolItem = nodeEvalList[index];
  $: ({ _id, cursor, parentBreadcrumbs } = currSpoolItem);

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

  $: astNode = ast.body;
  $: currentAstNodeItem = astNode[index] || '';
</script>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} line={cursor.programPart} />
<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program {cursor} />
      <!-- <SpoolItem {...currSpoolItem} templateType="animation" {meta} /> -->

      <p>{parentBreadcrumbs}, {_id}</p>
      <div class="box border">
        <SpoolItem
          {...justtheone}
          activeId={_id}
          bind:activeParentBreadcrumbs={parentBreadcrumbs}
          templateType="spool"
          {meta}
        />
      </div>
    </div>
    <div class="box border">
      <SpoolItem
        {...justtheone}
        activeId={_id}
        bind:activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="animation"
        {meta}
      />
    </div>
  </div>
  <div class="border">
    <h3>astNode Item</h3>
    <TempCurrentSpoolItem ast={JSON.stringify(currSpoolItem)} />
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
    height: 700px; /* with page zoom at 67%*/
  }
  .active {
    color: orange;
  }
</style>
