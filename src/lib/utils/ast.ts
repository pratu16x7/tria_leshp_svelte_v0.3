import { parse } from 'acorn';
import { getRandomId } from './_index';
import {
  binaryOperatorMap,
  modeBlocksEmpty,
  bequeathEvalEmpty,
  assignmentOperatorMap,
  astNodeTypesMeta
} from './what-we-support';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

//  indicates if you're part of the main (animation) spool
function clearPlayerState(spoolItem) {
  // console.log('spoolItem =======', spoolItem);
  Object.values(spoolItem['context']).map((playerState) => {
    playerState['isPlaying'] = false;
  });
}

// export function basicEvaluateAST(ast) {}

export function unspoolExecute(ast, program) {
  let linearSpool = [];

  let prevFullSpoolItem;

  function evaluate(
    node,
    execLevel = -1,
    modeBlocks = modeBlocksEmpty,
    bequeathEval = bequeathEvalEmpty
  ) {
    // bequeathEval is used to show you want to focus on the expression which is otherwise not top level
    let context = prevFullSpoolItem?.context || {}; // by reference, hence change reflect in object too
    modeBlocks = structuredClone(modeBlocks);
    let nodeType = node.type;
    let cursor = { start: node.start, end: node.end };
    let programPart = program.slice(cursor.start, cursor.end);
    let _res;
    execLevel += 1;

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
      topLevel: astNodeTypesMeta[nodeType].topLevel ? true : false,
      anim: astNodeTypesMeta[nodeType].anim ? true : false
    };

    if (astNodeTypesMeta[nodeType].spoolPush === 'before') {
      linearSpool.push(spoolItem);
    }

    switch (nodeType) {
      case 'Literal':
        _res = node.value;
        break;

      case 'Identifier':
        context[node.name]['isPlaying'] = true; // participating player
        _res = context[node.name]['value']; // no eval needed, just context
        break;

      case 'ExpressionStatement':
        _res = evaluate(node.expression, execLevel, modeBlocks); // come in last like a good person (eg. VariableDeclaration)
        break;

      case 'ArrayExpression':
        _res = node.elements.map((element) => evaluate(element, execLevel, modeBlocks));
        break;

      case 'BlockStatement':
        node.body.map((statement) => evaluate(statement, execLevel, modeBlocks));
        break;

      case 'VariableDeclaration':
        node.declarations.map((declaration) => {
          let varName = declaration.id.name;
          spoolItem['context'][varName] = {
            value: evaluate(declaration.init, execLevel, modeBlocks),
            isPlaying: true // persists, working
          };
        });
        break;

      case 'UnaryExpression':
        // TODO: what if this is not the final test
        if (bequeathEval.parent) {
          modeBlocks.blocksSoFar.push({
            name: programPart,
            type: 'test',
            parent: bequeathEval.parent
          });

          spoolItem['modeBlocks'] = modeBlocks;
        }

        if (bequeathEval) {
          spoolItem['anim'] = true;
          // TODO: ANIM: if anim, in general, note which players involved, and mark them 'updated', no actually, 'playing'
          prevFullSpoolItem = structuredClone(spoolItem);
          clearPlayerState(prevFullSpoolItem);
        }

        const arg = evaluate(node.argument, execLevel, modeBlocks);

        switch (node.operator) {
          case '!':
            _res = !arg;
          default:
            throw new Error('Unsupported unary operator: ' + node.operator);
        }
        break;

      case 'BinaryExpression':
        // TODO: what if this is not the final test
        if (bequeathEval.parent) {
          modeBlocks.blocksSoFar.push({
            name: programPart,
            type: 'test',
            parent: bequeathEval.parent
          });

          spoolItem['modeBlocks'] = modeBlocks;
        }

        if (bequeathEval) {
          spoolItem['anim'] = true;
          // TODO: ANIM: if anim, in general, note which players involved, and mark them 'updated', no actually, 'playing'
          prevFullSpoolItem = structuredClone(spoolItem);
          clearPlayerState(prevFullSpoolItem);
        }

        const left = evaluate(node.left, execLevel, modeBlocks);
        const right = evaluate(node.right, execLevel, modeBlocks);

        _res = binaryOperatorMap[node.operator](left, right);
        break;

      case 'AssignmentExpression':
        let varName = node.left.name;

        const leftValue = evaluate(node.left, execLevel, modeBlocks);
        const rightValue = evaluate(node.right, execLevel, modeBlocks);

        _res = assignmentOperatorMap[node.operator](leftValue, rightValue);
        context[varName]['value'] = _res;
        context[varName]['isPlaying'] = true; // active (updated) player
        break;

      case 'UpdateExpression':
        varName = node.argument.name;

        _res = updateOperatorMap[node.operator](context[varName]['value']);
        context[varName]['value'] = _res;
        context[varName]['isPlaying'] = true; // active (updated) player
        break;

      case 'IfStatement':
        // I put my mark on you, all the node generated here in
        // if you have already a mark, I put one yet after
        // and then the spool sees a new mark, and so cocoons you
        // until the mark is gone

        // Or what ho, just make a json tree again
        // just have children in this node itself
        // Muuuuuuch easier

        // WhileLoop will have to have a children grid
        function ifTest() {
          let ifTestEval = evaluate(node.test, execLevel, modeBlocks, {
            parent: 'IfStatement'
          });
          if (linearSpool.length) {
            let ifTestSpoolItem = linearSpool[linearSpool.length - 1];

            modeBlocks = ifTestSpoolItem['modeBlocks'];
            spoolItem['modeBlocks'] = modeBlocks;
            ifTestSpoolItem['modeBlocks'] = modeBlocks;
          }

          return ifTestEval;
        }

        // of course, a literal If else
        if (ifTest()) {
          evaluate(node.consequent, execLevel, modeBlocks); // usually a block stmt
        } else if (node.alternate) {
          evaluate(node.alternate, execLevel, modeBlocks); // usually a block stmt
        }

        break;

      case 'WhileStatement':
        function whileTest() {
          let testEval = evaluate(node.test, execLevel, modeBlocks, {
            parent: 'WhileStatement'
          });

          if (linearSpool.length) {
            let WhileTestSpoolItem = linearSpool[linearSpool.length - 1];

            modeBlocks = WhileTestSpoolItem['modeBlocks'];
            spoolItem['modeBlocks'] = modeBlocks;
            WhileTestSpoolItem['modeBlocks'] = modeBlocks;
          }
          return testEval;
        }

        // of course, a literal while loop
        while (whileTest()) {
          evaluate(node.body, execLevel, modeBlocks);
        }
        break;

      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg, execLevel, modeBlocks));

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            linearSpool.push(spoolItem);
            break;
          }

          const object = evaluate(callee.object, execLevel, modeBlocks);
          const property = callee.property.name;

          if (typeof object[property] === 'function') {
            return object[property](...args);
          } else {
            throw new Error('Unsupported method: ' + property);
          }
        }
        break;

      case 'MemberExpression':
        const object = evaluate(node.object, execLevel, modeBlocks);
        const property = node.computed
          ? evaluate(node.property, execLevel, modeBlocks)
          : node.property.name;
        _res = object[property];
        break;

      default:
        linearSpool.push(spoolItem);
        throw new Error('Unsupported node type: ' + node.type);
    }

    if (astNodeTypesMeta[nodeType].clearPlayers) {
      prevFullSpoolItem = structuredClone(spoolItem);
      clearPlayerState(prevFullSpoolItem);
    }

    if (astNodeTypesMeta[nodeType].spoolPush === 'after') {
      linearSpool.push(spoolItem);
    }

    return _res;
  }

  for (let node of ast.body) {
    evaluate(node);
    // treeSpool.push(treeSpoolItem);
  }

  return linearSpool;
}
