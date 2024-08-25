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
      backgroundColor: '#f0f0f0',
      selection: false,
      perPixelTargetFind: true
    });

    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    canvas.on('mouse:wheel', (opt) => {
      if (opt.e.ctrlKey) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.99 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.1) zoom = 0.1;
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      } else {
        var deltaX = opt.e.deltaX * -1;
        var deltaY = opt.e.deltaY * -1;
        canvas.relativePan({ x: deltaX, y: deltaY });
      }
      opt.e.preventDefault();
      opt.e.stopPropagation();
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
      fill: 'black',
      fontSize: 14,
      selectable: false
    });
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
      url: node.url
    });
    group.on('mousedown', function () {
      window.open(this.url);
    });
    canvas.add(group);
  }
</script>

<canvas id="graph-canvas"></canvas>
