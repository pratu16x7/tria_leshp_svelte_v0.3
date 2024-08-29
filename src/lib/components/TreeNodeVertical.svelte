<script>
  export let node; // The node data structure passed down to represent each node
</script>

<div class="level-container">
  <div class="node-container">
    <div class="fixed-width">
      {node.label}
    </div>
    <!-- Display vertical line connector if there are children -->
    {#if node.children.length > 0}
      <div class="line-connector">
        <div class="horizontal-line"></div>
      </div>
    {/if}
    <div class="flexible-content">
      <!-- Recursively render child nodes, if any -->

      {#each node.children as child}
        <svelte:self node={child} />
      {/each}
    </div>
  </div>
</div>

<style>
  .level-container {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* Spacing between levels */
  }

  .node-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px; /* Spacing between sibling nodes */
  }

  .fixed-width {
    width: 120px;
    flex-shrink: 0;
    background-color: #f0f0f0;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
  }

  .flexible-content {
    display: flex;
    justify-content: center;
    margin-top: 10px; /* Spacing between parent and children */
  }

  .line-connector {
    width: 2px;
    height: 20px;
    background-color: #ccc;
    position: relative;
  }

  .horizontal-line {
    position: absolute;
    top: 50%;
    left: -10px;
    right: -10px;
    height: 2px;
    background-color: #ccc;
  }
</style>
