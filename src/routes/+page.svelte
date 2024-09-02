<script lang="ts">
  import { programs } from '../data/programs/sample_program.js';
  import Layout from './__layout.svelte';

  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import { getAST, unspoolExecute } from '../lib/utils/ast';
  import Graph from '../lib/components/Graph.svelte';
  import jsonData from '../data/islands/test_problems.canvas?raw';

  let canvasData = JSON.parse(jsonData);

  // Example algorithm family and program
  const sampleFamily = 'test_programs';
  const sampleProgram = 'array_1';

  export let program: string;

  program = programs[sampleFamily][sampleProgram]['text'];

  // WIP: Barricade, error handling, don't navigate beyond upper and lower indexes
  $: index = 0;

  $: ast = getAST(program);
  $: [justtheone, nodeEvalList] = unspoolExecute(ast, program);
  $: currSpoolItem = nodeEvalList[index];
  $: ({ _id, cursor, parentBreadcrumbs } = currSpoolItem);

  // TODO: Big WIP
  let meta = {
    l: {
      pointer_1: 'j'
    },
    s: {
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

<svelte:window on:keydown={onKeyDown} />
<main class="story">
  <h1>Trialgo</h1>

  <!-- Both subtiltes have their own problems. See what's more important to you. -->
  <p class="subtitle">Visualize tiny programs as you write them.</p>
  <!-- <p class="subtitle">Visualize tiny programs as they run.</p> -->

  <div class="box flex">
    <!-- TODO:
    - [x] Dump all
    - [x] more style: only program should show, fix horizontal size
        - [x] more style fixes, ask claude for help
    - [x] simplify implementation: move into onmount, rm dead code
    - [ ] HARD editable program: BIND THE PROGRAM, so when we change it, things happen:
        - [x] oh okay the obchange thingy worked
        - [x] svelte doesn't need deboucing right?
        - [ ] but you will have certain period when the program in invalid, so you need to debounce
        - [ ] add a pipeline in the middle that checks the code
          - [ ] and if program invalid:
             - [ ] Show error and link for mor einfor
             - [ ] disables the animation
          - [ ] if valid
             - [ ] makes a new AST
             - [ ] rerenders and restarts animation from the start
        - [ ] rerun automatically with svelte react. GO SVELTE TRULY REACTIVE!
        - [ ] Reset button that appears when program changed
    - [ ] HARD fix animation
        - [ ] make it absolutely positioned
        - [ ]
        - [ ] rm headings, better loop representation
        - [ ] juudge the number of loops
        - [ ] ...list more edge cases to test later
        - [ ] list more
            - [ ] meta work
            - [ ] multiple pointers work
            - [ ] substring work
            - [ ] more player components
    - [ ] select a program: maybe uncompress
    - [ ] syntax and support check
    - [ ] animation progress bar
  -->

    <FunctionPreview bind:program {cursor} />
    <SpoolItem
      {...justtheone}
      activeId={_id}
      activeParentBreadcrumbs={parentBreadcrumbs}
      templateType="animation"
      {meta}
    />
  </div>
  <p>{program}</p>
  <p class="box-caption">
    Use arrow keys to move up and down the program. Edit and replay.
    <!-- Use arrow keys to move up and down the program. <a href="/">Edit</a> and replay. -->
    <a href="/{sampleFamily}/{sampleProgram}">Sample Array Program</a>
  </p>

  <div class="box flex">
    <!-- TODO:
    - [ ] different program here
    - [ ] arrow keys should only work on box that is in viewport
      - [ ] arrow keys should not cause page to scroll
  -->
    <FunctionPreview bind:program {cursor} />
    <SpoolItem
      {...justtheone}
      activeId={_id}
      activeParentBreadcrumbs={parentBreadcrumbs}
      templateType="animation"
      {meta}
    />
  </div>
  <p class="box-caption">Add comments to tell a story.</p>

  <div class="box large-box flex">
    <!-- TODO:
    - [ ] island page routing work
    - [ ] world map decide
    - [ ]
  -->
    <div>
      <FunctionPreview bind:program {cursor} />
      <SpoolItem
        {...justtheone}
        activeId={_id}
        activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="animation"
        {meta}
      />
    </div>
    <SpoolItem
      {...justtheone}
      activeId={_id}
      activeParentBreadcrumbs={parentBreadcrumbs}
      templateType="tree-minimap"
      {meta}
    />
  </div>
  <p class="box-caption">Bird's eye view of the full storyboard.</p>

  <!--  Try an edge case preset. -->

  <div class="box medium-box overflow">
    <Graph {canvasData} canvasHeight={280} />
  </div>
  <p class="box-caption">
    Explore programs in different domains. See the <a href="/world_map">World Map</a> ->
  </p>

  <section class="center">
    <p>
      Intended for tiny programs, upto 20 lines: I think it's important to grok the basic (and yet
      quite complex ones like DP) before going for elaborate, which are usually just variants.
    </p>
    <p>
      More programs being worked upon! Hope to cover as many as I can. Only JS supported for now.
    </p>
    <p>I feel breaking/puzzling/studying new programs like this is very educational.</p>
    <p>Very much WIP, looking for feedback</p>
    <p>Will see if this is something that I should work on getting</p>
    <p>personal project Made it for me, if it helps even one other folk I'd be glad :)</p>
  </section>

  <footer>
    <p>
      <a href="/why">Why?</a> ·
      <a href="https://github.com/pratu16x7/tria_leshp_svelte_v0.3">Github</a>
    </p>
    <p class="made-with">
      Made with love by <a href="https://github.com/pratu16x7">Prateeksha</a>.
    </p>
  </footer>
</main>

<style lang="scss">
  /* TODO:
  - [ ] 0.8 font size
  - [ ] download font locally
  */
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');

  :global(body) {
    font-family: 'Fira Mono', monospace;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    color: rgb(44, 44, 44);
  }

  :global(.story) {
    max-width: 800px;
    margin: 0 auto;
  }

  :global(.center) {
    text-align: center;

    font-size: 0.8em;
    margin-top: 5em; /* rm */
  }

  :global(footer) {
    margin-top: 40px;
    font-size: 0.8em;
    text-align: center;
  }

  :global(.made-with) {
    margin-top: 20px;
    /* font-style: italic; */
  }

  h1 {
    font-size: 5em;
    text-align: center;
    margin-top: 5rem;
    // margin-bottom: 1rem;
  }
  .subtitle {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 5rem;
  }

  .box {
    border: 1px solid #e3e3e3;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    height: 300px;
  }

  .medium-box {
    height: 450px;
  }

  .large-box {
    height: 600px;
  }

  .box-caption {
    font-size: 0.8em;
    text-align: center;
    margin-top: 10px;
    // color: #7c7c7c;
    margin-bottom: 5rem;
  }

  .flex {
    display: flex;
  }

  .overflow {
    overflow: scroll;
  }
</style>
