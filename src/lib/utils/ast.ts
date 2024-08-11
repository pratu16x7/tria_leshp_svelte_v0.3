import { parse } from 'acorn';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

export const spoolItemBase = {
  nodeType: '',
  execLevel: 0,
  context: {},
  newPlayers: {},
  interactions: {}
};

export function unspoolExecute(ast, spool = [spoolItemBase]) {
  function evaluate(node, execLevel = 0) {
    let context = structuredClone(spool[spool.length - 1]['context']);
    let newPlayers = {};
    let interactions = {};

    switch (node.type) {
      case 'VariableDeclaration':
        // Is a new player (var) added to the scope
        for (let declaration of node.declarations) {
          let varName = declaration.id.name;
          let varValue = evaluate(declaration.init, execLevel + 1);
          context[varName] = varValue;
          newPlayers[varName] = varValue;
        }
        break;
      case 'Literal':
        // is just a, well, literal value
        spool.push({ nodeType: node.type, execLevel, context, newPlayers, interactions });
        return node.value;
      case 'BinaryExpression':
        // is one of the math operations, with a left, right and operator
        const left = evaluate(node.left, execLevel + 1);
        const right = evaluate(node.right, execLevel + 1);
        interactions = { left, right, fn: node.operator };

        switch (node.operator) {
          case '+':
            return left + right;
          case '-':
            return left - right;
          case '*':
            return left * right;
          case '/':
            return left / right;
          // modulo and others
          default:
            throw new Error('Unsupported operator: ' + node.operator);
        }
      case 'Identifier':
        // is a player (var) from the scope
        spool.push({ nodeType: node.type, execLevel, context, newPlayers, interactions });
        return context[node.name];
      case 'ExpressionStatement':
        // Ya know this is a tricky one
        spool.push({ nodeType: node.type, execLevel, context, newPlayers, interactions });
        return evaluate(node.expression, execLevel + 1);
      case 'CallExpression':
        // is an outright function call
        interactions = { arguments: node.arguments, fn: node.callee };
        console.log('Not handled');
        break;
      default:
        spool.push({ nodeType: node.type, execLevel, context, newPlayers, interactions });
        throw new Error('Unsupported node type: ' + node.type);
    }
    // // instead of pushing context here at the end of every top level node of ast.body
    // // push it at every case above
    // // and note the level just in case
    // // then you can basically add your sparkles case by case
    spool.push({ nodeType: node.type, execLevel, context, newPlayers, interactions });
    // // wait but that's ... every case is inside the fucntion
    // // where do we update the context then?
    // // before return statement?
    // // yep at least before return (and throw) statements,
    // // the rest can have a common one at the bottom after all
  }

  for (let node of ast.body) {
    evaluate(node);
    // console.log('Context:', spool);
  }

  return spool;
}
