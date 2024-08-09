<script>
  import Counter from '../lib/components/Counter.svelte';
  import FunctionPreview from '../lib/FunctionPreview.svelte';
  import TempCurrentSpoolItem from '../lib/components/TempCurrentSpoolItem.svelte';
  import ProgramInputs from '../lib/components/ProgramInputs.svelte';
  import TemplateForArrayDSA from '../lib/TemplateForArrayDSA.svelte';
  import { sampleProgram2 } from '../data/sample_program.js';
  import { getAST } from '../lib/utils/ast';

  let program = sampleProgram2;
  $: lines = program.split('\n');

  $: index = 0;

  $: currentLine = lines[index] || '';

  let ast = getAST(program);

  $: spool = ast.body;
  $: currentSpoolItem = spool[index] || '';

  $: console.log('Debug AST', ast);
</script>

<h1>Leshp</h1>

<!-- wow bind works parent to child ... (go to Function preview) -->
<Counter bind:count={index} />

<div class="container">
  <div class="top-row">
    <div class="box border">
      <FunctionPreview bind:program />
    </div>
    <div class="box border">
      <h3>Program Inputs</h3>
      <ProgramInputs firstLine={currentLine} />
    </div>
    <div class="box border">
      <h3>current spool</h3>
      <ProgramInputs firstLine={JSON.stringify(currentSpoolItem)} />
    </div>
    <div class="box border">
      <h3>Spool</h3>
      <TempCurrentSpoolItem ast={spool} />
    </div>
  </div>
  <div class="border">
    <TemplateForArrayDSA firstLine={currentLine} />
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
    height: 200px;
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
