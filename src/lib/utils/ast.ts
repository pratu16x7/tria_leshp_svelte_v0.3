import { parse } from 'acorn';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

export function executeAST(ast, spool = [{}]) {
  function evaluate(node) {
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
        const left = evaluate(node.left);
        const right = evaluate(node.right);
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
        return evaluate(node.expression);
      case 'CallExpression':
        const args = node.arguments.map((arg) => evaluate(arg));
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'console' &&
          node.callee.property.name === 'log'
        ) {
          console.log(...args);
          // document.getElementById('output').textContent += args.join(' ') + '\n';
        }
        break;
      default:
        throw new Error('Unsupported node type: ' + node.type);
    }
    spool.push(context);
  }

  for (let node of ast.body) {
    evaluate(node);
    console.log('Context:', spool);
    // document.getElementById('output').textContent += 'Context: ' + JSON.stringify(context) + '\n';
  }

  return spool;
}
