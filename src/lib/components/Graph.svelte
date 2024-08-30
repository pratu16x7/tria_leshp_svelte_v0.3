<script>
  import { onMount } from 'svelte';
  import { getGraphic } from '../utils/graphics.ts';
  import State from './State.svelte';

  export let canvasData;
  let container;
  let canvasBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  let canvasWidth = 0;
  let canvasHeight = 0;

  let scale = 1;
  let originX = 0;
  let originY = 0;

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
        border-width: 2px;
        border-color: ${node.color || 'white'};
        box-sizing: border-box;
        transition: width 0.2s ease-in-out;
        transition: height 0.2s ease-in-out;
      `;
  }

  function handleWheel(event) {
    if (event.ctrlKey) {
      event.preventDefault();
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const delta = -event.deltaY;
      const factor = 0.05;
      const newScale = scale * (1 + factor * Math.sign(delta));
      if (newScale >= 0.1 && newScale <= 5) {
        const dx = (x - originX) / scale;
        const dy = (y - originY) / scale;
        originX = x - dx * newScale;
        originY = y - dy * newScale;
        scale = newScale;
      }
    }
  }
</script>

<div
  class="canvas-container"
  bind:this={container}
  on:wheel|stopPropagation|preventDefault={handleWheel}
>
  <div
    class="canvas"
    style="transform: scale({scale}) translate({-originX}px, {-originY}px); transform-origin: 0 0;"
  >
    {#each canvasData.nodes as node (node.id)}
      <!-- TODO: rm hardcoding -->
      <a href="/test_programs/{node.text}" class="node {node.type}" style={getNodeStyle(node)}>
        {#if node.type === 'text'}
          <!-- TODO: rm hardcoding -->
          {@const [context, meta] = getGraphic()}
          <div class="text-content">
            {@html node.text}
          </div>
          <State {context} {meta} scaleDown={true} />

          <!-- {:else if node.type === 'link'}
          <iframe src={node.url} title="Embedded content" width="100%" height="100%" frameborder="0"
          ></iframe> -->
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
    min-height: 700px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    overflow: hidden;
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
