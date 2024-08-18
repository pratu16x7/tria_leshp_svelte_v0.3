import { parse } from 'acorn';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

export const metaBase = {
  players: {},
  relations: {}
};

export const spoolItemBase = {
  nodeType: '',
  execLevel: 0,
  context: {},
  newPlayers: {},
  interactions: {},
  literalValue: [],
  cursor: {}
};

// https://stackoverflow.com/a/7390612/6495043
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

export function unspoolExecute(
  ast,
  spool = [spoolItemBase],
  fullSpool = [spoolItemBase],
  meta = metaBase
) {
  function evaluate(node, execLevel = 0) {
    let context = structuredClone(fullSpool[fullSpool.length - 1]['context']);
    let nodeType = node.type;
    let cursor = { start: node.start, end: node.end };

    let spoolItem = {
      nodeType,
      execLevel,
      context,
      newPlayers: {},
      interactions: {},
      literalValue: [],
      cursor
    };

    switch (nodeType) {
      case 'VariableDeclaration':
        // LVL 0
        // Is a new player (var) added to the scope
        for (let declaration of node.declarations) {
          let varName = declaration.id.name;
          let varValue = evaluate(declaration.init, execLevel + 1);
          let newPlayerMeta = {
            name: varName,
            type: toType(varValue)
          };
          meta['players'][varName] = newPlayerMeta;
          spoolItem['context'][varName] = varValue;
          // spoolItem['context'][varName] = varValue;
          spoolItem['newPlayers'][varName] = varValue;
        }
        spool.push(spoolItem);
        fullSpool.push(spoolItem);

        break;
      case 'Literal':
        // is just a, well, literal value
        spoolItem['literalValue'].push(node.value);
        fullSpool.push(spoolItem);
        return node.value;
      case 'ArrayExpression':
        fullSpool.push(spoolItem);
        return node.elements.map((element) => evaluate(element));
      case 'UnaryExpression':
        const arg = evaluate(node.argument, execLevel + 1);
        spoolItem['interactions'] = { arg, fn: node.operator };
        fullSpool.push(spoolItem);
        switch (node.operator) {
          case '!':
            return !arg;
          default:
            throw new Error('Unsupported unary operator: ' + node.operator);
        }
      case 'BinaryExpression':
        // is one of the math operations, with a left, right and operator
        const left = evaluate(node.left, execLevel + 1);
        const right = evaluate(node.right, execLevel + 1);
        spoolItem['interactions'] = { left, right, fn: node.operator };
        fullSpool.push(spoolItem);

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
          case '<':
            return left < right;
          case '>':
            return left > right;
          case '<=':
            return left <= right;
          case '>=':
            return left >= right;
          case '==':
            return left == right;
          case '===':
            return left === right;
          case '!=':
            return left != right;
          case '!==':
            return left !== right;
          default:
            throw new Error('Unsupported operator: ' + node.operator);
        }
      case 'Identifier':
        spoolItem['interactions'] = { player: node.name };
        // is a player (var) from the scope
        fullSpool.push(spoolItem);
        // Where the real eval magic happens: get the context var VALUE not var name
        return spoolItem['context'][node.name];
      // return spoolItem['context'][node.name];
      case 'ExpressionStatement':
        // LVL 0
        spool.push(spoolItem);
        fullSpool.push(spoolItem);
        return evaluate(node.expression, execLevel + 1);
      case 'WhileStatement':
        while (evaluate(node.test, execLevel + 1)) {
          evaluate(node.body, execLevel + 1);
        }
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        break;
      case 'IfStatement':
        if (evaluate(node.test, execLevel + 1)) {
          evaluate(node.consequent, execLevel + 1);
        } else if (node.alternate) {
          evaluate(node.alternate, execLevel + 1);
        }
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        break;
      case 'BlockStatement':
        for (let statement of node.body) {
          evaluate(statement, execLevel + 1);
        }
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        break;
      case 'AssignmentExpression':
        const assignmentValue = evaluate(node.right, execLevel + 1);
        context[node.left.name] = assignmentValue;
        spoolItem['interactions'] = { target: node.left.name, value: assignmentValue };
        fullSpool.push(spoolItem);
        return assignmentValue;
      case 'UpdateExpression':
        const varName = node.argument.name;
        if (node.operator === '++') {
          context[varName] += 1;
        } else if (node.operator === '--') {
          context[varName] -= 1;
        }
        fullSpool.push(spoolItem);
        break;
      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg));

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            fullSpool.push(spoolItem);
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
        fullSpool.push(spoolItem);
        break;
      case 'MemberExpression':
        const obj = evaluate(node.object);
        const prop = node.computed ? evaluate(node.property) : node.property.name;
        return obj[prop];
      default:
        fullSpool.push(spoolItem);
        throw new Error('Unsupported node type: ' + node.type);
    }
  }

  for (let node of ast.body) {
    evaluate(node);
    // console.log('Context:', spool);
  }

  return spool;
}
