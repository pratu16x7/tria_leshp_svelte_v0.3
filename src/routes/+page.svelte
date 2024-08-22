<script>
  import CodeAnimationRunner from '../lib/CodeAnimationRunner.svelte';
  import { testPrograms, algorithms } from '../data/sample_program.js';

  let program = testPrograms['whileLoop']['text'];
  // let program = algorithms['uncompress']['text'];
</script>

<CodeAnimationRunner {program} />
