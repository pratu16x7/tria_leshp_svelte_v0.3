<script>
  import SvelteMarkdown from 'svelte-markdown';
  import whyStory from '../../../static/why.md?raw';
</script>

<main class="story">
  <SvelteMarkdown source={whyStory} />
</main>

<footer>
  <p>
    <a href={`/`}>Back home</a> ·
    <a href="https://github.com/pratu16x7/tria_leshp_svelte_v0.3">Github</a>
  </p>
  <p class="made-with">
    Made with love by <a href="https://github.com/pratu16x7">Prateeksha</a>.
  </p>
</footer>
