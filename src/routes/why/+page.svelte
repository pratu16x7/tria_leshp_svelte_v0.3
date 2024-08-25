<script>
  import SvelteMarkdown from 'svelte-markdown';
  import whyStory from '../../static/why.md?raw';
</script>

<a href={`/`}>Back home</a>
<SvelteMarkdown source={whyStory} />
