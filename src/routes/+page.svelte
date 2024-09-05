<script lang="ts">
  import Demo1 from '../lib/Demo1.svelte';
  import Graph from '../lib/components/Graph.svelte';
  import { programs } from '../data/programs/sample_program.js';
  import jsonData from '../data/islands/test_problems.canvas?raw';

  let canvasData = JSON.parse(jsonData);

  // Example algorithm family and program
  const sampleFamily1 = 'test_programs';
  const sampleProgram1 = 'array_1';

  export let program1, program2, program3: string;

  program1 = programs[sampleFamily1][sampleProgram1]['text'];
  program2 = programs[sampleFamily1]['uncompress']['text'];
  program3 = programs[sampleFamily1]['else']['text'];
</script>

<main class="story">
  <h1>Trialgo</h1>

  <!-- Both subtiltes have their own problems. See what's more important to you. -->
  <p class="subtitle">Visualize tiny programs as you write them.</p>
  <!-- <p class="subtitle">Visualize tiny programs as they run.</p> -->

  <Demo1 program={program2} />
  <p class="box-caption">
    Use arrow keys to move up and down the program. Edit and replay.
    <!-- Use arrow keys to move up and down the program. <a href="/">Edit</a> and replay. -->
    <a href="/test_programs/array_1">Sample Array Program</a>
  </p>

  <!-- TODO:


OKAYYYYY:
- 1 array program
  - [ ] _
  - [ ] _
- HARD Recursion
  - [ ] _
  - [ ] _
- tree programs, implemement the DS then check if the map works
  - [ ] _
  - [ ] _
- DP
  - [ ] _
  - [ ] _
- [ ]



    - [ ] different program here
    - [ ] arrow keys should only work on box that is in viewport
      - [ ] arrow keys should not cause page to scroll
      - [ ] HARD: decide arrow keys behaviour with text focus inside editor
    - can acorn read comments, it can but not in the AST, so collect them like this: https://github.com/acornjs/acorn/issues/753#issuecomment-1120222466
    - [ ] decide what you want the demo to do with comments
      - [ ] then decide the contract
    - [ ] write the comment collection code
      - [ ] _
      - [ ] _
    - [ ] test, debug
    - [ ] sample comment buttons
  -->
  <!-- <Demo1 program={program1} demoType="minimap" />
  <p class="box-caption">Add comments to tell a story.</p> -->

  <!-- TODO:
    - [ ] minimap fix heights
      - [ ] _
      - [ ] _
    - [ ] minimap fix color correlation as there's not much else
      - [ ] _
      - [ ] _
    - [ ] mega map format
      - [ ] _
      - [ ] _
    - [ ] _

  -->

  <!-- <Demo1 program={program1} demoType="minimap" />
  <p class="box-caption">Bird's eye view of the full storyboard.</p> -->

  <!--  Try an edge case preset. -->

  <div class="box medium-box overflow">
    <!-- TODO:
    - [ ] island page routing work
      - [ ] _
      - [ ] _
    - [ ] world map decide
      - [ ] _
      - [ ] _
      - [ ] _
      - [ ] _
    - [ ]
  -->
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
    <p>
      My rule is to never automate until I have done it atleast 10 times manually. Well I did, so it
      was time
    </p>
    <p>
      Thank you <a href="https://marijnhaverbeke.nl/">Marijn Haverbeke</a> (acorn, codemirror) and other
      awesome folks whose worked on these projects on which this heavily depends on
    </p>
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
    max-width: 1000px;
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

  // okay from here on in demo files

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

  :global(.flex) {
    display: flex;
  }

  :global(.overflow) {
    overflow: scroll;
  }

  :global(.hide) {
    display: none;
  }
</style>
