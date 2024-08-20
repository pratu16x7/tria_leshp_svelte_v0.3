
// {#each spool as spoolItem, i}
//   <SpoolItem {...spoolItem} active={i === index + 1} {meta} />
// {/each}


// case 'IfStatement':
//   const testResult = evaluate(node.test);
//   if (testResult) {
//     node.consequent.body.forEach(evaluate);
//   } else if (node.alternate) {
//     node.alternate.body.forEach(evaluate);
//   }
//   break;
// case 'WhileStatement':
//   // oh lookie here, an actual loop
//   while (evaluate(node.test)) {
//     node.body.body.forEach(evaluate);
//     console.log('Context (inside while loop):', context);
//     // document.getElementById('output').textContent +=
//     //   'Context (inside while loop): ' + JSON.stringify(context) + '\n';
//   }
//   break;
// case 'UpdateExpression':
//   const varName = node.argument.name;
//   if (node.operator === '++') {
//     context[varName] += 1;
//   } else if (node.operator === '--') {
//     context[varName] -= 1;
//   }
//   break;



// explanation for highliting https://stackoverflow.com/a/72793520/6495043
// forum example I copied: https://discuss.codemirror.net/t/codemirror-6-highlighting-specific-substring/6615
const highlight_effect = StateEffect.define<Range<Decoration>[]>();

const highlight_extension = StateField.define({
  create() { return Decoration.none },
  update(value, transaction) {
	value = value.map(transaction.changes)

	for (let effect of transaction.effects) {
	  if (effect.is(highlight_effect)) value = value.update({add: effect.value, sort: true})
	}

	return value
  },
  provide: f => EditorView.decorations.from(f)
});

let state = EditorState.create({/* ... */ extensions: [highlight_extension]});

let view = new EditorView({
  state,
  parent: element
});


let cursor = new SearchCursor(view.state.doc, "# COMPLETE THIS");

cursor.next();

const highlight_decoration = Decoration.mark({
  attributes: {style: "background-color: yellow"}
});

view.dispatch({
  effects: highlight_effect.of([highlight_decoration.range(cursor.value.from, cursor.value.to)])
});






const highlightDeco = Decoration.mark({ class: 'highlight' });

let builder = new RangeSetBuilder();
builder.add(from, to, highlightDeco);

let decoSet = builder.finish();

console.log(editor);

editor?.dispatch({
  effects: EditorView.decorations.of(decoSet)
});




<script lang="ts">
  export let program: string;
</script>

<div>
  <!-- wow bind works child to parent ... (go to +page.svelte) -->
  <textarea bind:value={program} />
</div>

<style>
  textarea {
    width: 300px;
    height: 150px;
  }
</style>





<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';

  export let program;

  let editorContainer;

  onMount(() => {
    let editor = new EditorView({
      doc: program,
      extensions: [basicSetup, javascript()],
      parent: editorContainer,
      readOnly: true
    });

    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: program }
    });

    editor.updateListener = (update) => {
      if (update.changes) {
        program = update.state.doc.toString();
      }
    };
  });

  $: if (editorContainer) {
    editorContainer.innerHTML = '';
    let editor = new EditorView({
      doc: program,
      extensions: [basicSetup, javascript()],
      parent: editorContainer
    });
  }
</script>

<div bind:this={editorContainer} class="editor"></div>

<style>
  .editor {
    height: 100%;
    width: 100%;
    border: 1px solid #ddd;
  }
  /* .CodeMirror {
    height: 100%;
  } */
</style>


// <!--https://github.com/touchifyapp/svelte-codemirror-editor-->
// <script lang="ts">
//   import CodeMirror from 'svelte-codemirror-editor';
//   import { javascript } from '@codemirror/lang-javascript';

//   // let value = '';
//   export let program: string;
// </script>

// <div>
//   <!-- wow bind works child to parent ... (go to +page.svelte) -->
//   <!-- <textarea bind:value={program} /> -->
//   <CodeMirror
//     bind:value={program}
//     lang={javascript()}
//     readonly={true}
//     styles={{
//       '&': {}
//     }}
//   />
// </div>

// <style>
//   /* CodeMirror {
//     width: 300px;
//     height: 150px;
//   } */
// </style>

// // vit.config.ts
// optimizeDeps: {
//   exclude: ['svelte-codemirror-editor', 'codemirror', '@codemirror/language-javascript' /* ... */]
// }





// <script lang="ts">
//   export let program: string;
// </script>

// <div>
//   <textarea bind:value={program} />
// </div>

// <style>
//   textarea {
//     width: 300px;
//     height: 150px;
//   }
// </style>



export function unspoolExecute(ast, spool = [{}], level = 0) {
	function evaluate(node, execLevel = 0) {
	  let context = structuredClone(spool[spool.length - 1]);
	  switch (node.type) {
		case 'VariableDeclaration':
		  console.log(node.type, level);
		  for (let declaration of node.declarations) {
			// spool.push(context);
			// // context = structuredClone(spool[spool.length - 1]);
			// context = structuredClone(context);
			// // spool.push(context);
			context[declaration.id.name] = evaluate(declaration.init, execLevel + 1);
		  }
		  // spool.push(context);
		  break;
		case 'Literal':
		  console.log(node.type, level);
		  // spool.push(context);
		  return node.value;
		case 'BinaryExpression':
		  console.log(node.type, level);
		  const left = evaluate(node.left, execLevel + 1);
		  const right = evaluate(node.right, execLevel + 1);
		  spool.push(context);
		  switch (node.operator) {
			case '+':
			  return left + right;
			case '-':
			  return left - right;
			case '*':
			  return left * right;
			case '/':
			  return left / right;
			default:
			  throw new Error('Unsupported operator: ' + node.operator);
		  }

		case 'Identifier':
		  console.log(node.type, level);
		  return context[node.name];
		case 'ExpressionStatement':
		  console.log(node.type, level);
		  return evaluate(node.expression, execLevel + 1);
		case 'CallExpression':
		  console.log(node.type, level, 'Not handled');
		default:
		  console.log(node.type, level, 'Not handled');
		  throw new Error('Unsupported node type: ' + node.type);
	  }
	  // instead of pushing context here at the end of every top level node of ast.body
	  // push it at every case above
	  // and note the level just in case

	  spool.push(context);

	  // wait but that's ... every case is inside the fucntion
	  // where do we update the context then?
	  // before return statement
	}

	for (let node of ast.body) {
	  evaluate(node);
	  // console.log('Context:', spool);
	  // document.getElementById('output').textContent += 'Context: ' + JSON.stringify(context) + '\n';
	}

	return spool;
  }


    case 'CallExpression':
        console.log(node.type, level)
        // const args = node.arguments.map((arg) => evaluate(arg));
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'console' &&
          node.callee.property.name === 'log'
        ) {
          // console.log(...args);
          // document.getElementById('output').textContent += args.join(' ') + '\n';
        }


function evaluate(node, level = 0) {
  let context = structuredClone(spool[spool.length - 1]);
  switch (node.type) {
    case 'VariableDeclaration':
      for (let declaration of node.declarations) {
        context[declaration.id.name] = evaluate(declaration.init);
      }
      break;
    case 'Literal':
      return node.value;
    case 'BinaryExpression':
      const left = evaluate(node.left, level + 1);
      const right = evaluate(node.right, level + 1);
      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        default:
          throw new Error('Unsupported operator: ' + node.operator);
      }
    case 'Identifier':
      return context[node.name];
    case 'ExpressionStatement':
      return evaluate(node.expression, level + 1);
	//   ...
	//   ...
	//   ...
  }
}

// spool.push([context]);

// why does this get only a = 1?, oh right coz it needs change at structuredClone to get the 0th element,
// and passed deafault sool value, and passed value in parent as well

// let firstLine = '';

// function updateFirstLine() {
//   const lines = program.split('\n');
//   firstLine = lines[0] || '';
// }

// onMount(updateFirstLine);

// $: updateFirstLine();
