<script lang="ts">
  import { page } from '$app/stores';
  // import { programs } from '../../static/programs/sample_program.js';
  let algorithmFamily: string = '';

  $: {
    const params = $page.params;
    algorithmFamily = params['algorithm_family'];

    // TODO: better incorrect route error handling
  }
</script>

<!-- TODO: better incorrect route error handling -->
<h1>{algorithmFamily} Island</h1>
<a href={`/`}>Back home</a>
<p>Welcome to the Island page!</p>
