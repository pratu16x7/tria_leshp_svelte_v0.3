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
  interactions: {},
  literalValue: []
};

export function unspoolExecute(ast, spool = [spoolItemBase]) {
  function evaluate(node, execLevel = 0) {
    // let context = ;
    // let newPlayers = {};
    // let interactions = {};
    // let literalValue = {};
    let spoolItem = {
      nodeType: node.type,
      execLevel,
      context: structuredClone(spool[spool.length - 1]['context']),
      newPlayers: {},
      interactions: {},
      literalValue: []
    };

    switch (node.type) {
      case 'VariableDeclaration':
        // Is a new player (var) added to the scope
        for (let declaration of node.declarations) {
          let varName = declaration.id.name;
          let varValue = evaluate(declaration.init, execLevel + 1);
          spoolItem['context'][varName] = varValue;
          spoolItem['newPlayers'][varName] = varValue;
        }
        break;
      case 'Literal':
        // is just a, well, literal value
        spoolItem['literalValue'].push(node.value);
        spool.push(spoolItem);
        return node.value;
      case 'ArrayExpression':
        spool.push(spoolItem);
        return node.elements.map((element) => evaluate(element));
      case 'BinaryExpression':
        // is one of the math operations, with a left, right and operator
        const left = evaluate(node.left, execLevel + 1);
        const right = evaluate(node.right, execLevel + 1);
        spoolItem['interactions'] = { left, right, fn: node.operator };

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
          // case '<': return left < right;
          // case '>': return left > right;
          // case '<=': return left <= right;
          // case '>=': return left >= right;
          // case '==': return left == right;
          // case '===': return left === right;
          // case '!=': return left != right;
          // case '!==': return left !== right;
          default:
            throw new Error('Unsupported operator: ' + node.operator);
        }
      case 'Identifier':
        // is a player (var) from the scope
        spool.push(spoolItem);
        return spoolItem['context'][node.name];
      case 'ExpressionStatement':
        // Ya know this is a tricky one
        spool.push(spoolItem);
        return evaluate(node.expression, execLevel + 1);
      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg));

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            break;
          }

          const object = evaluate(callee.object);
          const property = callee.property.name;

          if (typeof object[property] === 'function') {
            return object[property](...args);
          } else {
            throw new Error('Unsupported method: ' + property);
          }
        }
        break;
      case 'MemberExpression':
        const obj = evaluate(node.object);
        const prop = node.computed ? evaluate(node.property) : node.property.name;
        return obj[prop];
      default:
        spool.push(spoolItem);
        throw new Error('Unsupported node type: ' + node.type);
    }
    // // instead of pushing context here at the end of every top level node of ast.body
    // // push it at every case above
    // // and note the level just in case
    // // then you can basically add your sparkles case by case
    spool.push(spoolItem);
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
