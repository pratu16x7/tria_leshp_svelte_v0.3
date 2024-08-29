<script>
  export let node; // The node data structure passed down to represent each node
</script>

<div class="node-container">
  <div class="fixed-width">
    <!-- This part represents the fixed-width content of the node -->
    {node.label}
  </div>
  <div class="flexible-width">
    <div class="flexible-content">
      <!-- Recursively render child nodes, if any -->
      {#each node.children as child}
        <svelte:self node={child} />
      {/each}
    </div>
  </div>
</div>

<style>
  .node-container {
    display: flex;
    align-items: center;
    margin-left: 20px; /* Indentation for child nodes */
  }

  .fixed-width {
    width: 120px;
    flex-shrink: 0;
    background-color: #f0f0f0;
    padding: 10px;
    box-sizing: border-box;
  }

  .flexible-width {
    flex-grow: 1;
    white-space: nowrap;
    padding: 10px;
    box-sizing: border-box;
  }

  .flexible-content {
    display: inline-block;
  }
</style>
