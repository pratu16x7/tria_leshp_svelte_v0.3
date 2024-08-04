<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import TemplateForArrayDSA from '../lib/TemplateForArrayDSA.svelte';
  import sampleProgram from '../data/sample_program.js';

  let program = sampleProgram;
  $: lines = program.split('\n');
  $: firstLine = lines[0] || '';
</script>

<h1>Leshp</h1>

<Counter />

<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program />
    </div>
    <div class="box border">
      <TempCurrentSpoolItem {firstLine} />
    </div>
  </div>
  <div class="border">
    <TemplateForArrayDSA {firstLine} />
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    width: 100%;
    margin: 1em;
  }
  .box {
    /* margin: 1em; */
    padding: 1em;
    flex: 1;
  }
</style>
