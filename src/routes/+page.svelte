<script lang="ts">
  import { programs } from '../static/programs/sample_program.js';
  import Layout from './__layout.svelte';

  // Example algorithm family and program
  const sampleFamily = 'test_programs';
  const sampleProgram = 'array_1';
</script>

<Layout title="Algorithm Runner">
  <h1>Welcome to the Algorithm Runner</h1>

  <p>Click the link below to see an example program animation:</p>

  <a href="/{sampleFamily}/{sampleProgram}">Run Sample Array Program</a>

  <p>Or you can explore</p>

  <nav>
    <ul>
      <li><a href="/{sampleFamily}">Island</a></li>
      <li><a href="/world_map">World Map</a></li>
      <li><a href="/why">Why?</a></li>
      <!-- <li><a href="/settings">Settings</a></li> -->
    </ul>
  </nav>
</Layout>
