<script>
  import { onMount } from 'svelte';
  import { Canvas, Text, Rect, Group, IText } from 'fabric';
  import jsonData from '../../static/data.json';

  let canvas;
  let { nodes, edges } = jsonData;
  let isDragging = false;
  let lastPosX, lastPosY;

  onMount(() => {
    canvas = new Canvas('graph-canvas', {
      width: 1900,
      height: 1000,
      backgroundColor: '#f0f0f0',
      selection: false
    });

    canvas.forEachObject((obj) => (obj.selectable = false));

    canvas.on('mouse:down', (opt) => {
      var evt = opt.e;
      if (evt.altKey === true) {
        isDragging = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (isDragging) {
        var e = opt.e;
        canvas.relativePan({ x: e.clientX - lastPosX, y: e.clientY - lastPosY });
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', () => {
      isDragging = false;
    });

    canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
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
