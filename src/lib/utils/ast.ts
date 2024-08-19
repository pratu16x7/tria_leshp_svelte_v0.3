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
  modeBlock: {},
  interactions: {},
  literalValue: [],
  cursor: { start: 0, end: 0 },
  index: 0,
  programPart: '',
  topLevel: false
};

// https://stackoverflow.com/a/7390612/6495043
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

function clearPlayerState(spoolItem) {
  // console.log('spoolItem =======', spoolItem);
  Object.values(spoolItem['context']).map((playerState) => {
    playerState['isUpdated'] = false;
  });
}

export function unspoolExecute(
  ast,
  program,
  spool = [spoolItemBase],
  fullSpool = [spoolItemBase],
  meta = metaBase
) {
  let prevFullSpoolItem = structuredClone(fullSpool[fullSpool.length - 1]);
  function evaluate(node, execLevel = 0, modeBlock = {}, modeEval = false) {
    let context = prevFullSpoolItem['context'];
    let nodeType = node.type;
    let cursor = { start: node.start, end: node.end };
    let programPart = program.slice(cursor.start, cursor.end);

    let spoolItem = {
      nodeType,
      execLevel,
      context,
      modeBlock,
      interactions: {},
      literalValue: [],
      cursor,
      programPart,
      topLevel: false
    };

    let newPlayer = {};
    let newPlayerMeta = {};

    let nextExecLevel = execLevel + 1;

    switch (nodeType) {
      // case 'VariableDeclaration':
      case 'VariableDeclaration':
        // LVL 0
        // Is a new player (var) added to the scope
        for (let declaration of node.declarations) {
          let varName = declaration.id.name;
          let varValue = evaluate(declaration.init, nextExecLevel, modeBlock);
          newPlayerMeta = {
            name: varName,
            type: toType(varValue)
          };
          newPlayer = {
            value: varValue,
            isUpdated: true // persists, working
          };
          meta['players'][varName] = newPlayerMeta;
          spoolItem['context'][varName] = newPlayer;
          // spoolItem['newPlayers'][varName] = varValue;
        }
        spoolItem['index'] = fullSpool.length;
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        prevFullSpoolItem = structuredClone(spoolItem);
        clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;
        break;

      // case 'Literal':
      case 'Literal':
        // is just a, well, literal value
        spoolItem['literalValue'].push(node.value);
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        return node.value;

      // case 'ArrayExpression':
      case 'ArrayExpression':
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        return node.elements.map((element) => evaluate(element, nextExecLevel, modeBlock));

      // case 'UnaryExpression':
      case 'UnaryExpression':
        const arg = evaluate(node.argument, nextExecLevel, modeBlock);
        spoolItem['interactions'] = { arg, fn: node.operator };
        spoolItem['index'] = fullSpool.length;

        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);

        switch (node.operator) {
          case '!':
            return !arg;
          default:
            throw new Error('Unsupported unary operator: ' + node.operator);
        }

      // case 'BinaryExpression':
      case 'BinaryExpression':
        // is one of the math operations, with a left, right and operator
        if (modeEval) {
          modeBlock = { test: programPart };

          spoolItem['modeBlock'] = modeBlock;
        }

        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        if (modeEval) {
          spool.push(spoolItem);
          clearPlayerState(prevFullSpoolItem);
        }

        const left = evaluate(node.left, nextExecLevel, modeBlock);
        const right = evaluate(node.right, nextExecLevel, modeBlock);
        spoolItem['interactions'] = { left, right, fn: node.operator };
        let binaryExpResult;

        switch (node.operator) {
          case '+':
            binaryExpResult = left + right;
            break;
          case '-':
            binaryExpResult = left - right;
            break;
          case '*':
            binaryExpResult = left * right;
            break;
          case '/':
            binaryExpResult = left / right;
            break;
          // modulo and others
          case '<':
            binaryExpResult = left < right;
            break;
          case '>':
            binaryExpResult = left > right;
            break;
          case '<=':
            binaryExpResult = left <= right;
            break;
          case '>=':
            binaryExpResult = left >= right;
            break;
          case '==':
            binaryExpResult = left == right;
            break;
          case '===':
            binaryExpResult = left === right;
            break;
          case '!=':
            binaryExpResult = left != right;
            break;
          case '!==':
            binaryExpResult = left !== right;
            break;
          default:
            throw new Error('Unsupported operator: ' + node.operator);
        }

        return binaryExpResult;

      // case 'Identifier':
      case 'Identifier':
        spoolItem['interactions'] = { player: node.name };
        // is a player (var) from the scope
        spoolItem['index'] = fullSpool.length;
        spoolItem['context'][node.name]['isUpdated'] = true; // participating player
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        // Where the real eval magic happens: get the context var VALUE not var name
        return spoolItem['context'][node.name]['value'];

      // case 'ExpressionStatement':
      case 'ExpressionStatement':
        // LVL 0
        let exp_result = evaluate(node.expression, nextExecLevel, modeBlock);
        spoolItem['index'] = fullSpool.length;
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        prevFullSpoolItem = structuredClone(spoolItem);
        clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;

        // come in last like a good person (eg. VariableDeclaration)
        return exp_result;

      // case 'WhileStatement':
      case 'WhileStatement':
        // of course, a literal while loop
        while (evaluate(node.test, nextExecLevel, modeBlock)) {
          evaluate(node.body, nextExecLevel, modeBlock);
        }
        spoolItem['index'] = fullSpool.length;
        fullSpool.push(spoolItem);
        spool.push(spoolItem);
        prevFullSpoolItem = structuredClone(spoolItem);
        clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;
        break;

      // case 'IfStatement':
      case 'IfStatement':
        spoolItem['index'] = fullSpool.length;
        fullSpool.push(spoolItem);
        // spool.push(spoolItem);  // Naa don't wanna give any attention to the whole block, unless necessary, only to its statements
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;

        let testEval = evaluate(node.test, nextExecLevel, modeBlock, true);
        let testSpoolItem = fullSpool[fullSpool.length - 1];
        modeBlock = testSpoolItem['modeBlock'];
        spoolItem['modeBlock'] = modeBlock;
        testSpoolItem['modeBlock'] = modeBlock;

        // of course, a literal If else
        if (testEval) {
          evaluate(node.consequent, nextExecLevel, modeBlock); // usually a block stmt
        } else if (node.alternate) {
          evaluate(node.alternate, nextExecLevel, modeBlock); // usually a block stmt
        }

        break;

      case 'BlockStatement':
        spoolItem['index'] = fullSpool.length;
        fullSpool.push(spoolItem);
        // spool.push(spoolItem);  // Naa don't wanna give any attention to the block, unless necessary, only to its statements
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;

        for (let statement of node.body) {
          evaluate(statement, nextExecLevel, modeBlock);
        }
        break;

      // The AssignmentExpression
      case 'AssignmentExpression':
        const leftValue = evaluate(node.left, nextExecLevel, modeBlock);
        const rightValue = evaluate(node.right, nextExecLevel, modeBlock);
        let result;

        switch (node.operator) {
          case '=':
            result = rightValue;
            break;
          case '+=':
            result = leftValue + rightValue;
            break;
          case '-=':
            result = leftValue - rightValue;
            break;
          case '*=':
            result = leftValue * rightValue;
            break;
          case '/=':
            result = leftValue / rightValue;
            break;
          // Add other compound operators as needed
          default:
            throw new Error('Unsupported operator: ' + node.operator);
        }

        spoolItem['context'][node.left.name]['value'] = result;
        spoolItem['context'][node.left.name]['isUpdated'] = true; // active (updated) player
        spoolItem['interactions'] = { target: node.left.name, value: result };
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        return result;

      case 'UpdateExpression':
        const varName = node.argument.name;
        context[varName]['isUpdated'] = true; // active (updated) player
        if (node.operator === '++') {
          context[varName]['value'] += 1;
        } else if (node.operator === '--') {
          context[varName]['value'] -= 1;
        }
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        break;

      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg, nextExecLevel, modeBlock));

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            // prevFullSpoolItem = structuredClone(spoolItem);
            // clearPlayerState(prevFullSpoolItem);
            fullSpool.push(spoolItem);
            break;
          }

          const object = evaluate(callee.object, nextExecLevel, modeBlock);
          const property = callee.property.name;

          if (typeof object[property] === 'function') {
            spoolItem['interactions'] = { args: [object, property, args] }; // array.push doesn't come here seems
            return object[property](...args);
          } else {
            throw new Error('Unsupported method: ' + property);
          }
        }
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
        fullSpool.push(spoolItem);
        break;

      case 'MemberExpression':
        const object = evaluate(node.object, nextExecLevel, modeBlock);
        const property = node.computed
          ? evaluate(node.property, nextExecLevel, modeBlock)
          : node.property.name;

        spoolItem['interactions'] = { args2: [object, property] }; // array.push doesn't come here seems
        return object[property];

      default:
        spoolItem['index'] = fullSpool.length;
        prevFullSpoolItem = structuredClone(spoolItem);
        // clearPlayerState(prevFullSpoolItem);
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
