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
// technically only needed when prevContext is updated
// But good to be sure always, in case of any future code, it will automatically handle it if we do on the top always
// so let's just lumpsum do on the top to take it out of any future doubts, it's a harmless fucntion
function clearPlayerPlayingState(context) {
  Object.values(context).map((playerState) => {
    playerState['isPlaying'] = false;
  });
  return context;
}

// export function basicEvaluateAST(ast) {}

export function unspoolExecute(ast, program) {
  let linearSpool = [];

  let prevContext;

  function evaluate(
    node,
    execLevel = -1,
    modeBlocks = modeBlocksEmpty,
    bequeathEval = bequeathEvalEmpty // bequeathEval is used to show you want to focus on the expression which is otherwise not top level
  ) {
    let nodeType = node.type;
    let cursor = {
      start: node.start,
      end: node.end,
      programPart: program.slice(node.start, node.end)
    };
    let levels = {
      anim: astNodeTypesMeta[nodeType].anim ? true : false,
      topLevel: astNodeTypesMeta[nodeType].topLevel ? true : false
    };
    execLevel += 1;

    // context is kept getting added to throughout, unlike execLevel which also has to decrease
    let context = prevContext ? clearPlayerPlayingState(prevContext) : {}; // by reference, hence change reflect in object too
    modeBlocks = structuredClone(modeBlocks);

    let _res;
    let linearSpoolItem = {
      _id: getRandomId(),
      nodeType,
      execLevel,
      context,
      modeBlocks,
      cursor,
      levels,
      _res
    };

    if (astNodeTypesMeta[nodeType].spoolPush === 'before') {
      linearSpool.push(linearSpoolItem);
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
        _res = evaluate(node.expression, execLevel, modeBlocks)._res; // come in last like a good person (eg. VariableDeclaration)
        prevContext = structuredClone(context);
        break;

      case 'ArrayExpression':
        _res = node.elements.map((element) => evaluate(element, execLevel, modeBlocks)._res);
        break;

      case 'BlockStatement':
        node.body.map((statement) => evaluate(statement, execLevel, modeBlocks));
        break;

      case 'VariableDeclaration':
        node.declarations.map((declaration) => {
          let varName = declaration.id.name;
          context[varName] = {
            value: evaluate(declaration.init, execLevel, modeBlocks)._res,
            isPlaying: true // persists, working
          };
        });
        prevContext = structuredClone(context);
        break;

      case 'UnaryExpression':
        // TODO: copy what Binary does
        // TODO: what if this is not the final test
        const arg = evaluate(node.argument, execLevel, modeBlocks)._res;

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
            name: cursor.programPart,
            type: 'test',
            parent: bequeathEval.parent
          });
        }

        if (bequeathEval) {
          linearSpoolItem.levels.anim = true;
        }

        const left = evaluate(node.left, execLevel, modeBlocks)._res;
        const right = evaluate(node.right, execLevel, modeBlocks)._res;

        _res = binaryOperatorMap[node.operator](left, right);
        break;

      case 'AssignmentExpression':
        let varName = node.left.name;

        const leftValue = evaluate(node.left, execLevel, modeBlocks)._res;
        const rightValue = evaluate(node.right, execLevel, modeBlocks)._res;

        context[varName]['value'] = assignmentOperatorMap[node.operator](leftValue, rightValue);
        context[varName]['isPlaying'] = true; // active (updated) player
        break;

      case 'UpdateExpression':
        varName = node.argument.name;

        context[varName]['value'] = updateOperatorMap[node.operator](context[varName]['value']);
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
          })._res;
          if (linearSpool.length) {
            modeBlocks = linearSpool[linearSpool.length - 1]['modeBlocks'];
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
          })._res;

          if (linearSpool.length) {
            modeBlocks = linearSpool[linearSpool.length - 1]['modeBlocks'];
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
        const args = node.arguments.map((arg) => evaluate(arg, execLevel, modeBlocks)._res);

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            linearSpool.push(linearSpoolItem);
            break;
          }

          const evalalala = evaluate(callee.object, execLevel, modeBlocks);
          const object = evalalala._res;
          const property = callee.property.name;

          if (typeof object[property] === 'function') {
            _res = object[property](...args);
          } else {
            throw new Error('Unsupported method: ' + property);
          }
        }
        break;

      case 'MemberExpression':
        const object = evaluate(node.object, execLevel, modeBlocks)._res;
        const property = node.computed
          ? evaluate(node.property, execLevel, modeBlocks)._res
          : node.property.name;
        _res = object[property];
        break;

      default:
        linearSpool.push(linearSpoolItem);
        throw new Error('Unsupported node type: ' + node.type);
    }

    if (astNodeTypesMeta[nodeType].spoolPush === 'after') {
      linearSpool.push(linearSpoolItem);
    }

    linearSpoolItem._res = _res;
    return linearSpoolItem;
  }

  ast.body.map((node) => evaluate(node));

  return linearSpool;
}
