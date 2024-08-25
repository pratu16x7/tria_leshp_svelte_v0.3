<script>
  import { onMount } from 'svelte';
  import { Canvas, Text, Rect, Group, IText } from 'fabric';
  import jsonData from '../../static/data.json';

  let canvas;
  let { nodes, edges } = jsonData;

  onMount(() => {
    canvas = new Canvas('graph-canvas', {
      width: 1900,
      height: 1000,
      backgroundColor: '#f0f0f0'
    });

    nodes.forEach((node) => {
      switch (node.type) {
        case 'text':
          addTextNode(node);
          break;
        case 'link':
          addLinkNode(node);
          break;
      }
    });
  });

  function addTextNode(node) {
    const text = new IText(node.text, {
      left: node.x,
      top: node.y,
      width: node.width,
      fill: 'black',
      fontSize: 14,
      selectable: false
    });

    // Optional: Adjust text style if necessary
    text.set({ width: node.width, height: node.height });

    canvas.add(text);
  }

  function addLinkNode(node) {
    const rect = new Rect({
      left: node.x,
      top: node.y,
      width: node.width,
      height: node.height,
      fill: '#999'
    });

    const text = new IText('Link to Video', {
      left: node.x,
      top: node.y + node.height / 2,
      fontSize: 14,
      originX: 'center',
      originY: 'center',
      fill: 'white'
    });

    const group = new Group([rect, text], {
      hasControls: false,
      hasBorders: false,
      selectable: true,
      subTargetCheck: true,
      url: node.url // Store the URL in the group for easy access
    });

    // Add an event listener for clicks
    group.on('mousedown', function () {
      window.open(this.url); // Open the link in a new tab
    });

    canvas.add(group);
  }
</script>

<canvas id="graph-canvas"></canvas>
