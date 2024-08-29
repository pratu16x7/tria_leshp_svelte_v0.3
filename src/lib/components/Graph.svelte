<script>
  import { onMount } from 'svelte';

  export let canvasData;
  let container;
  let canvasBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  let canvasWidth = 0;
  let canvasHeight = 0;

  onMount(() => {
    calculateCanvasBounds();
  });

  function calculateCanvasBounds() {
    if (canvasData.nodes.length === 0) return;

    canvasBounds.minX = Math.min(...canvasData.nodes.map((n) => n.x));
    canvasBounds.minY = Math.min(...canvasData.nodes.map((n) => n.y));
    canvasBounds.maxX = Math.max(...canvasData.nodes.map((n) => n.x + n.width));
    canvasBounds.maxY = Math.max(...canvasData.nodes.map((n) => n.y + n.height));

    canvasWidth = canvasBounds.maxX - canvasBounds.minX;
    canvasHeight = canvasBounds.maxY - canvasBounds.minY;
  }

  function getNodeStyle(node) {
    return `
        position: absolute;
        left: ${node.x - canvasBounds.minX}px;
        top: ${node.y - canvasBounds.minY}px;
        width: ${node.width}px;
        height: ${node.height}px;
        overflow: auto;
        border: 1px solid #ccc;
        padding: 8px;
        background-color: ${node.color || 'white'};
        box-sizing: border-box;
        transition: width 0.2s ease-in-out;
        transition: height 0.2s ease-in-out;
      `;
  }
</script>

<div class="canvas-container" bind:this={container}>
  <div class="canvas">
    {#each canvasData.nodes as node (node.id)}
      <a href="/test_programs/if" class="node {node.type}" style={getNodeStyle(node)}>
        {#if node.type === 'text'}
          <div class="text-content">{@html node.text}</div>
        {:else if node.type === 'link'}
          <iframe src={node.url} title="Embedded content" width="100%" height="100%" frameborder="0"
          ></iframe>
        {/if}
      </a>
    {/each}
  </div>
</div>

<style>
  .canvas-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 800px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
  }

  .canvas {
    position: relative;
    background-color: white;
  }

  .node {
    background-color: white;
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
    transition: box-shadow 0.2s ease-in-out;
  }

  .node:hover {
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
    width: 500px;
    height: 500px;
  }

  .text-content {
    white-space: pre-wrap;
  }
</style>
