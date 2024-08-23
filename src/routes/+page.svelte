<script>
  import CodeAnimationRunner from '../lib/CodeAnimationRunner.svelte';
  import { testPrograms, algorithms } from '../programs/sample_program.js';

  // let program = testPrograms['whileLoop']['text'];
  let program = testPrograms['array_pointer_1']['text'];
  // let program = algorithms['uncompress']['text'];
</script>

<!-- Will be based on routes -->
<CodeAnimationRunner {program} />
