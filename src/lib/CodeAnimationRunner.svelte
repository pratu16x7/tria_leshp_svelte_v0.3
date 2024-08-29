<script lang="ts">
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

  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
        index -= 1;
        break;
      case 40: // down
        index += 1;
        break;
      case 37: // left
        index -= 1;
        break;
      case 39: // right
        index += 1;
        break;
    }
  }
</script>

<!-- wow bind works parent to child ... (go to Function preview) ... oh it doesn't anymore with codemirror-->
<!-- <Counter bind:count={index} line={cursor.programPart} /> -->
<div class="container">
  <div class="top-row">
    <div class="box border flex-1">
      <h3>Leshp ___ {cursor.programPart}</h3>
      <FunctionPreview bind:program {cursor} />
      <SpoolItem
        {...justtheone}
        activeId={_id}
        activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="animation"
        {meta}
      />
    </div>
    <div class="box border flex-2">
      <SpoolItem
        {...justtheone}
        activeId={_id}
        activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="tree"
        {meta}
      />
    </div>
  </div>
  <div>
    <h3>astNode Item</h3>
    <TempCurrentSpoolItem ast={JSON.stringify(currSpoolItem)} />
    <TempCurrentSpoolItem ast={JSON.stringify(currentAstNodeItem)} />
  </div>
</div>

<svelte:window on:keydown={onKeyDown} />

<style lang="scss">
  .top-row {
    display: flex;
  }

  .flex-1 {
    flex: 1; /* Takes 1 part of the available space */
  }

  .flex-2 {
    flex: 2; /* Takes 2 parts of the available space */
  }

  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em;
  }

  .box {
    overflow: scroll;
    height: 900px; /* with page zoom at 67%*/
  }
</style>
