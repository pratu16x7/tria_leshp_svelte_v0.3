<script lang="ts">
  import { page } from '$app/stores';
  import CodeAnimationRunner from '../../../lib/CodeAnimationRunner.svelte';
  import { programs } from '../../../programs/sample_program.js';

  let program: string = '';
  let algorithmFamily: string = '';

  $: {
    const params = $page.params;
    algorithmFamily = params['algorithm_family'];
    const programName: string = params['program'];

    // TODO: better incorrect route error handling
    program = programs[algorithmFamily]?.[programName]?.text || 'Program not found';
    // console.log('===============', params, program, programs);
    // program = 'let a = 1;';
  }
</script>

<!-- TODO: better incorrect route error handling -->
<a href={`/`}>Back home</a>
<CodeAnimationRunner {program} />
