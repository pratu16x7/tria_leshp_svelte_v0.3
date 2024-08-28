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
  let linearSpoolNodes = [];
  let linearSpoolIds = [];

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
    execLevel += 1;

    // context is kept getting added to throughout (only works on objects not arrays), unlike execLevel which also has to decrease
    let context = prevContext ? clearPlayerPlayingState(prevContext) : {}; // by reference, hence change reflect in object too
    modeBlocks = structuredClone(modeBlocks);

    let anim = astNodeTypesMeta[nodeType].anim ? true : false;
    let _res;

    // TODO: interface
    let testAndBlock = {
      test: {},
      block: { children: [] }
    };

    let loopAndBlocks = {
      testAndBlocks: []
    };

    let children = [];

    let _id = getRandomId();

    let evalNode = {
      _id,
      nodeType,
      execLevel,
      context,
      modeBlocks,
      cursor,
      anim,
      _res,
      testAndBlock,
      loopAndBlocks,
      children
    };

    if (astNodeTypesMeta[nodeType].linearSpoolPush === 'before') {
      linearSpoolNodes.push(evalNode);
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

      case 'Program':
      case 'BlockStatement':
        evalNode.children = node.body.map((node) => evaluate(node, execLevel, modeBlocks));
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

        const left = evaluate(node.left, execLevel, modeBlocks);
        const right = evaluate(node.right, execLevel, modeBlocks);

        // testAndBlock = [left, right];

        _res = binaryOperatorMap[node.operator](left._res, right._res);
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
          let ifTestEvalSpoolItem = evaluate(node.test, execLevel, modeBlocks, {
            parent: 'IfStatement'
          });
          if (linearSpoolNodes.length) {
            modeBlocks = linearSpoolNodes[linearSpoolNodes.length - 1]['modeBlocks'];
          }

          return ifTestEvalSpoolItem;
        }

        let ifBlock;
        let ifTestItem = ifTest();
        // of course, a literal If else
        if (ifTestItem._res) {
          ifBlock = evaluate(node.consequent, execLevel, modeBlocks); // usually a block stmt
        } else if (node.alternate) {
          ifBlock = evaluate(node.alternate, execLevel, modeBlocks); // usually a block stmt
        }

        testAndBlock.test = ifTestItem;

        // Antipattern for AST: pass over of responsibility to the test node
        testAndBlock.block = ifBlock;

        break;

      case 'WhileStatement':
        function whileTest() {
          let testEvalSpoolItem = evaluate(node.test, execLevel, modeBlocks, {
            parent: 'WhileStatement'
          });

          if (linearSpoolNodes.length) {
            modeBlocks = linearSpoolNodes[linearSpoolNodes.length - 1]['modeBlocks'];
          }
          return testEvalSpoolItem;
        }

        let whileTestItem;
        let whileBlock;
        let whileTestAndBlock;
        // of course, a literal while loop
        let whileTestRes = true;
        while (whileTestRes) {
          whileTestItem = whileTest();
          whileTestRes = whileTestItem._res;
          if (whileTestRes) {
            whileBlock = evaluate(node.body, execLevel, modeBlocks);

            loopAndBlocks.testAndBlocks.push({
              test: whileTestItem,
              block: whileBlock // Antipattern for AST: pass over of responsibility to the test node
            });
          }
        }

        break;

      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg, execLevel, modeBlocks)._res);

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
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
        throw new Error('Unsupported node type: ' + node.type + ' - ' + JSON.stringify(evalNode));
    }

    if (astNodeTypesMeta[nodeType].linearSpoolPush === 'after') {
      linearSpoolNodes.push(evalNode);
    }

    if (anim) {
      linearSpoolIds.push(evalNode);
    }

    evalNode._res = _res;
    return evalNode;
  }

  let justtheone = evaluate(ast);

  return [justtheone, linearSpoolIds];
  // return [justtheone];
}
