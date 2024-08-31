<script lang="ts">
  import Graph from '../../lib/components/Graph.svelte';
  import jsonData from '../../data/islands/test_problems.canvas?raw';

  let canvasData = JSON.parse(jsonData);

  let algorithmFamily: string = '';
</script>

<a href={`/`}>Back home</a>
<h1>World Map</h1>
<p>Explore the world map here.</p>
<a href="/test-problems">Island</a>
<svg class="canvas-background"
  ><pattern
    id="22db99975ad1285f"
    patternUnits="userSpaceOnUse"
    x="398.3521327930829"
    y="493.0729393503405"
    width="12.556004668820538"
    height="12.556004668820538"><circle cx="0.7" cy="0.7" r="0.7"></circle></pattern
  ><rect x="0" y="0" width="100%" height="100%" fill="url(#22db99975ad1285f)"></rect></svg
>

<Graph {canvasData} />
