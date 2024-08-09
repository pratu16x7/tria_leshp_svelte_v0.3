<script>
  export let firstLine;
  export let ast;
  let json = JSON.stringify(ast);
</script>

<div>
  <p>{'firstLine'}</p>
  <p>{firstLine}</p>
  <p>{json}</p>
</div>
