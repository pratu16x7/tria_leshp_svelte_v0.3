<script>
  //   import { onMount } from 'svelte';
  import response from '../../static/data.json';

  let nodes = [];
  let links = [];

  //   const response = await fetch('/data.json');
  const { nodes: loadedNodes, links: loadedLinks } = response;
  nodes = loadedNodes;
  links = loadedLinks;

  const calculatePosition = (index, total) => {
    const radius = 200;
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    };
  };
</script>

<svg width="600" height="600">
  {#each links as link}
    <line
      x1={calculatePosition(
        nodes.findIndex((node) => node.id === link.source),
        nodes.length
      ).x}
      y1={calculatePosition(
        nodes.findIndex((node) => node.id === link.source),
        nodes.length
      ).y}
      x2={calculatePosition(
        nodes.findIndex((node) => node.id === link.target),
        nodes.length
      ).x}
      y2={calculatePosition(
        nodes.findIndex((node) => node.id === link.target),
        nodes.length
      ).y}
      stroke="black"
    />
  {/each}
  {#each nodes as node, index}
    <circle
      cx={calculatePosition(index, nodes.length).x}
      cy={calculatePosition(index, nodes.length).y}
      r="30"
      fill="blue"
    />
    <text
      x={calculatePosition(index, nodes.length).x}
      y={calculatePosition(index, nodes.length).y}
      fill="white"
      text-anchor="middle"
      alignment-baseline="central"
    >
      {node.title}
    </text>
  {/each}
</svg>
