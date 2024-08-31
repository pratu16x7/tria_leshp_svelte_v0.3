<script lang="ts">
  // import { programs } from '../../static/programs/sample_program.js';
  import Layout from './__layout.svelte';

  // Example algorithm family and program
  const sampleFamily = 'test_programs';
  const sampleProgram = 'array_1';
</script>

<main class="story">
  <h1>Trialgo</h1>
  <p class="subtitle">Visualize tiny programs as you write them.</p>

  <div class="box"></div>
  <p class="box-caption">
    Use arrow keys to move up and down the program.
    <a href="/{sampleFamily}/{sampleProgram}">Sample Array Program</a>
  </p>

  <div class="box"></div>
  <p class="box-caption">Edit and replay. Or try a preset. Add comments to tell a story.</p>

  <div class="box"></div>
  <p class="box-caption">Bird's eye view of the full storyboard</p>

  <div class="box"></div>
  <p class="box-caption">
    Explore programs in different domains. See all: <a href="/world_map">World Map</a> ->
  </p>

  <section class="center">
    <p>More programs being worked upon! Hope to cover as many as I can.</p>
    <p>I feel studying/puzzling over new programs like this is very educational.</p>
    <p>Very much WIP, looking for feedback</p>
    <p>Is see if this is something that I should work on getting</p>
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
    min-height: 300px;
  }

  .box-caption {
    font-size: 0.8em;
    text-align: center;
    margin-top: 10px;
    // color: #7c7c7c;
    margin-bottom: 5rem;
  }
</style>
