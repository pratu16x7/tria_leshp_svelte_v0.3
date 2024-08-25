<script>
  import { onMount } from 'svelte';
  import { Canvas, Circle, Text, Group, Line } from 'fabric';

  import response from '../../static/data.json';

  let canvas;
  let nodes = [];
  let links = [];

  onMount(() => {
    //   const response = await fetch('/data.json');
    const { nodes: loadedNodes, links: loadedLinks } = response;
    //   const { nodes: loadedNodes, links: loadedLinks } = await response.json();
    nodes = loadedNodes;
    links = loadedLinks;

    // Initialize the Fabric Canvas
    canvas = new Canvas('graph-canvas', { width: 600, height: 600 });

    // Add nodes and links to the canvas
    nodes.forEach((node, index) => {
      addNode(node, index, nodes.length);
    });
    links.forEach((link) => {
      addLink(link);
    });
  });

  function calculatePosition(index, total) {
    const radius = 200;
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle)
    };
  }

  function addNode(node, index, total) {
    const position = calculatePosition(index, total);
    const circle = new Circle({
      radius: 30,
      fill: 'blue',
      left: position.x,
      top: position.y,
      originX: 'center',
      originY: 'center'
    });

    const text = new Text(node.title, {
      fontSize: 14,
      left: position.x,
      top: position.y,
      originX: 'center',
      originY: 'center',
      fill: 'white'
    });

    // Grouping circle and text allows them to be moved together
    const group = new Group([circle, text], {
      left: position.x,
      top: position.y,
      hasBorders: false,
      hasControls: false,
      selectable: false
    });

    canvas.add(group);
  }

  function addLink(link) {
    const sourceNode = nodes.find((node) => node.id === link.source);
    const targetNode = nodes.find((node) => node.id === link.target);
    const sourcePosition = calculatePosition(nodes.indexOf(sourceNode), nodes.length);
    const targetPosition = calculatePosition(nodes.indexOf(targetNode), nodes.length);

    const line = new Line(
      [sourcePosition.x, sourcePosition.y, targetPosition.x, targetPosition.y],
      {
        stroke: 'black'
      }
    );

    canvas.add(line);
  }
</script>

<canvas id="graph-canvas"></canvas>
