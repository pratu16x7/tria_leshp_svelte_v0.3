<script>
  export let node; // The node data structure passed down to represent each node
</script>

<div class="level-container">
  <div class="node-container">
    <div class="fixed-width">
      {node.label}
    </div>
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
    position: relative;
    margin-top: 20px; /* Spacing between levels */
  }

  .node-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px; /* Spacing between sibling nodes */
    position: relative;
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
    position: relative;
  }

  /* Oblique lines connecting parent to children */
  .node-container::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 2px solid #ccc;
    border-top: 2px solid #ccc;
    transform-origin: top left;
    width: 100px; /* Adjust this to control the diagonal line length */
    height: 100px; /* Adjust this to control the diagonal line angle */
    transform: rotate(-45deg); /* Adjust rotation to control the angle */
  }

  .flexible-content > .node-container::after {
    width: 100px; /* Adjust this to control the diagonal line length */
    height: 100px; /* Adjust this to control the diagonal line angle */
    transform: rotate(-45deg); /* Adjust rotation to control the angle */
  }

  .node-container:last-child::after {
    border-left: none;
  }
</style>
