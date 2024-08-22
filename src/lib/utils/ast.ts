import { parse } from 'acorn';
import { toType, getRandomId } from './_index';
import {
  binaryExpressionResultMap,
  metaBase,
  modeBlocksEmpty,
  bequeathEvalEmpty,
  spoolItemBase,
  assignmentExpressionMap
} from './what-we-support';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

//  indicates if you're part of the main (animation) spool
function clearPlayerState(spoolItem) {
  // console.log('spoolItem =======', spoolItem);
  Object.values(spoolItem['context']).map((playerState) => {
    playerState['isUpdated'] = false;
  });
}

export function unspoolExecute(ast, program, fullSpool = [spoolItemBase], meta = metaBase) {
  let prevFullSpoolItem = structuredClone(fullSpool[fullSpool.length - 1]);
  function evaluate(
    node,
    execLevel = 0,
    modeBlocks = modeBlocksEmpty,
    bequeathEval = bequeathEvalEmpty
  ) {
    // bequeathEval is used to show you want to focus on the expression which is otherwise not top level
    let context = prevFullSpoolItem['context'];
    modeBlocks = structuredClone(modeBlocks);
    let nodeType = node.type;
    let cursor = { start: node.start, end: node.end };
    let programPart = program.slice(cursor.start, cursor.end);

    let spoolItem = {
      _id: getRandomId(),
      nodeType,
      execLevel,
      context,
      modeBlocks,
      interactions: {},
      literalValue: [],
      cursor,
      programPart,
      topLevel: false,
      anim: false
    };

    let newPlayer = {};
    let newPlayerMeta = {};

    let nextExecLevel = execLevel + 1;

    switch (nodeType) {
      // case 'Literal': // is just a, well, literal value, // NO IMPORTANCE YET // ['literalValue'].push(node.value);
      case 'Literal':
        return node.value;

      // case 'Identifier': ['interactions'] = { player: node.name };
      case 'Identifier':
        // is a player (var) from the scope
        spoolItem['context'][node.name]['isUpdated'] = true; // participating player
        fullSpool.push(spoolItem);
        // Where the real eval magic happens: get the context var VALUE not var name
        return spoolItem['context'][node.name]['value'];

      // case 'VariableDeclaration':
      case 'VariableDeclaration':
        // LVL 0
        // Is a new player (var) added to the scope
        for (let declaration of node.declarations) {
          let varName = declaration.id.name;
          let varValue = evaluate(declaration.init, nextExecLevel, modeBlocks);
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
        fullSpool.push(spoolItem);
        prevFullSpoolItem = structuredClone(spoolItem);
        spoolItem['anim'] = true;
        clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;
        break;

      // case 'ExpressionStatement': // LVL 0
      case 'ExpressionStatement':
        let exp_result = evaluate(node.expression, nextExecLevel, modeBlocks);
        fullSpool.push(spoolItem);
        prevFullSpoolItem = structuredClone(spoolItem);
        spoolItem['anim'] = true;
        clearPlayerState(prevFullSpoolItem);
        spoolItem['topLevel'] = true;

        // come in last like a good person (eg. VariableDeclaration)
        return exp_result;

      // case 'UnaryExpression':
      case 'UnaryExpression':
        const arg = evaluate(node.argument, nextExecLevel, modeBlocks);
        spoolItem['interactions'] = { arg, fn: node.operator };

        fullSpool.push(spoolItem);

        switch (node.operator) {
          case '!':
            return !arg;
          default:
            throw new Error('Unsupported unary operator: ' + node.operator);
        }

      // case 'BinaryExpression': ['interactions'] = { left, right, fn: node.operator };
      case 'BinaryExpression':
        // is one of the math operations, with a left, right and operator

        // TODO: what if this is not the final test
        if (bequeathEval.parent) {
          // TODO: Get the parent type who ordered this test
          //
          modeBlocks.blocksSoFar.push({
            name: programPart,
            type: 'test',
            parent: bequeathEval.parent
          });
          // modeBlocks = { blocksSoFar: [{ test: programPart }] };

          spoolItem['modeBlocks'] = modeBlocks;
        }

        prevFullSpoolItem = structuredClone(spoolItem);
        fullSpool.push(spoolItem);

        if (bequeathEval) {
          spoolItem['anim'] = true;
          clearPlayerState(prevFullSpoolItem);
        }

        const left = evaluate(node.left, nextExecLevel, modeBlocks);
        const right = evaluate(node.right, nextExecLevel, modeBlocks);

        return binaryExpressionResultMap[node.operator](left, right);

      // case 'ArrayExpression':
      case 'ArrayExpression':
        fullSpool.push(spoolItem);
        return node.elements.map((element) => evaluate(element, nextExecLevel, modeBlocks));

      // The AssignmentExpression: ['interactions'] = { target: node.left.name, value: assignmentExpressionResult };
      case 'AssignmentExpression':
        const leftValue = evaluate(node.left, nextExecLevel, modeBlocks);
        const rightValue = evaluate(node.right, nextExecLevel, modeBlocks);

        let assignmentExpressionResult = assignmentExpressionMap[node.operator](
          leftValue,
          rightValue
        );

        spoolItem['context'][node.left.name]['value'] = assignmentExpressionResult;
        spoolItem['context'][node.left.name]['isUpdated'] = true; // active (updated) player
        fullSpool.push(spoolItem);
        return assignmentExpressionResult;

      // case 'IfStatement':
      case 'IfStatement':
        fullSpool.push(spoolItem); // Naa don't wanna give any attention to the whole block, unless necessary, only to its statements
        spoolItem['topLevel'] = true;

        let ifTestEval = evaluate(node.test, nextExecLevel, modeBlocks, { parent: 'IfStatement' });
        let ifTestSpoolItem = fullSpool[fullSpool.length - 1];

        modeBlocks = ifTestSpoolItem['modeBlocks'];
        spoolItem['modeBlocks'] = modeBlocks;
        ifTestSpoolItem['modeBlocks'] = modeBlocks;

        // of course, a literal If else
        if (ifTestEval) {
          evaluate(node.consequent, nextExecLevel, modeBlocks); // usually a block stmt
        } else if (node.alternate) {
          evaluate(node.alternate, nextExecLevel, modeBlocks); // usually a block stmt
        }

        break;

      // case 'WhileStatement':
      // Similar to handling structure of the 'IfStatement' block
      case 'WhileStatement':
        fullSpool.push(spoolItem); // Naa don't wanna give any attention to the whole block, unless necessary, only to its statements
        spoolItem['topLevel'] = true;

        function whileTest() {
          let testEval = evaluate(node.test, nextExecLevel, modeBlocks, {
            parent: 'WhileStatement'
          });
          let WhileTestSpoolItem = fullSpool[fullSpool.length - 1];

          modeBlocks = WhileTestSpoolItem['modeBlocks'];
          spoolItem['modeBlocks'] = modeBlocks;
          WhileTestSpoolItem['modeBlocks'] = modeBlocks;
          return testEval;
        }
        // of course, a literal while loop
        // while (evaluate(node.test, nextExecLevel, modeBlocks)) {
        while (whileTest()) {
          console.log('==========Here loop');
          evaluate(node.body, nextExecLevel, modeBlocks);
        }
        break;

      // BlockStatement:  // NO IMPORTANCE YET // Naa don't wanna give any attention to the block, unless necessary, only to its statements
      case 'BlockStatement':
        for (let statement of node.body) {
          evaluate(statement, nextExecLevel, modeBlocks);
        }
        break;

      case 'UpdateExpression':
        const varName = node.argument.name;
        context[varName]['isUpdated'] = true; // active (updated) player
        if (node.operator === '++') {
          context[varName]['value'] += 1;
        } else if (node.operator === '--') {
          context[varName]['value'] -= 1;
        }
        fullSpool.push(spoolItem);
        break;

      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg, nextExecLevel, modeBlocks));

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            fullSpool.push(spoolItem);
            break;
          }

          const object = evaluate(callee.object, nextExecLevel, modeBlocks);
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
        const object = evaluate(node.object, nextExecLevel, modeBlocks);
        const property = node.computed
          ? evaluate(node.property, nextExecLevel, modeBlocks)
          : node.property.name;
        return object[property];

      default:
        fullSpool.push(spoolItem);
        throw new Error('Unsupported node type: ' + node.type);
    }
  }

  for (let node of ast.body) {
    evaluate(node);
    // console.log('Context:', spool);
  }
}
