
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
