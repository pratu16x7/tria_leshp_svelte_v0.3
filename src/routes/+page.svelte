<script lang="ts">
  // import { programs } from '../../static/programs/sample_program.js';
  import Layout from './__layout.svelte';

  // Example algorithm family and program
  const sampleFamily = 'test_programs';
  const sampleProgram = 'array_1';
</script>

<main>
  <h1>Trialgo</h1>
  <p class="subtitle">Visualize tiny programs as you write them.</p>

  <div class="box">
    <p class="box-caption">Use arrow keys to move up and down the program.</p>
  </div>

  <div class="box">
    <p class="box-caption">Edit and replay. Or try a preset. Add comments to tell a story.</p>
  </div>

  <div class="box">
    <p class="box-caption">Bird's eye view of the full storyboard</p>
  </div>

  <div class="box">
    <p class="box-caption">Explore programs in different domains. See all -></p>
  </div>

  <footer>
    <p>More programs being worked upon! Hope to cover as many as I can.</p>
    <p>I feel studying/puzzling over new programs like this is very educational.</p>
    <p>Very much WIP, still in active development and ask for feedback</p>
    <p>Is see if this is something that I should work on getting</p>
    <p>cleaner, if not helping solve CS homework problems too.</p>
    <p>It will be very slow as I also have a day job.</p>
    <p>Some things I'd like to do...</p>
    <p>Wait? - @ath0</p>
    <p class="made-with">
      Made with love by <a href="https://github.com/pratu16x7">Prateeksha</a>.
    </p>
  </footer>

  <nav>
    <ul>
      <li><a href="/{sampleFamily}">Island</a></li>
      <li><a href="/world_map">World Map</a></li>
      <li><a href="/why">Why?</a></li>
      <!-- <li><a href="/settings">Settings</a></li> -->
      <a href="/{sampleFamily}/{sampleProgram}">Run Sample Array Program</a>
    </ul>
  </nav>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Fira+Mono&display=swap');

  :global(body) {
    font-family: 'Fira Mono', monospace;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    color: black;
  }

  h1 {
    font-size: 5em;
    text-align: center;
    margin-bottom: 0;
  }

  .subtitle {
    text-align: center;
    margin-top: 5px;
    margin-bottom: 30px;
  }

  .box {
    border: 1px solid black;
    padding: 20px;
    margin-bottom: 20px;
    min-height: 100px;
  }

  .box-caption {
    font-size: 0.8em;
    text-align: center;
    margin-top: 10px;
  }

  footer {
    margin-top: 40px;
    font-size: 0.8em;
    text-align: center;
  }

  .made-with {
    margin-top: 20px;
    /* font-style: italic; */
  }
</style>
