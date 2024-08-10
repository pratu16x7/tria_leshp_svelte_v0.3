import { parse } from 'acorn';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

export function unspoolExecute(ast, spool = [{ context: {} }]) {
  function evaluate(node, execLevel = 0) {
    let context = structuredClone(spool[spool.length - 1]['context']);
    console.log(node.type, execLevel);
    switch (node.type) {
      case 'VariableDeclaration':
        for (let declaration of node.declarations) {
          context[declaration.id.name] = evaluate(declaration.init, execLevel + 1);
        }
        break;
      case 'Literal':
        return node.value;
      case 'BinaryExpression':
        const left = evaluate(node.left, execLevel + 1);
        const right = evaluate(node.right, execLevel + 1);

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
        return evaluate(node.expression, execLevel + 1);
      case 'CallExpression':
        console.log('Not handled');
        break;
      default:
        throw new Error('Unsupported node type: ' + node.type);
    }
    // // instead of pushing context here at the end of every top level node of ast.body
    // // push it at every case above
    // // and note the level just in case
    // // then you can basically add your sparkles case by case
    spool.push({ context: context });
    // // wait but that's ... every case is inside the fucntion
    // // where do we update the context then?
    // // before return statement?
  }

  for (let node of ast.body) {
    evaluate(node);
    // console.log('Context:', spool);
  }

  return spool;
}
