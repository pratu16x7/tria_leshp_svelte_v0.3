import { parse } from 'acorn';
import { getRandomId } from './_index';
import { binaryOperatorMap, assignmentOperatorMap, astNodeTypesMeta } from './what-we-support';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

function clearPlayerPlayingState(context) {
  Object.values(context).map((playerState) => {
    playerState['isPlaying'] = false;
  });
  return context;
}

export function unspoolExecute(ast, program) {
  let linearSpoolNodes = [];

  let prevContext;

  function evaluate(node, execLevel: number = -1, parentBreadcrumbs: string[] = []) {
    let _id = getRandomId();
    let nodeType = node.type;
    let cursor = {
      start: node.start,
      end: node.end,
      programPart: program.slice(node.start, node.end)
    };
    execLevel += 1;

    // context is kept getting added to throughout (only works on objects not arrays), unlike execLevel which also has to decrease
    let context = prevContext ? clearPlayerPlayingState(prevContext) : {}; // by reference, hence change reflect in object too
    parentBreadcrumbs = structuredClone(parentBreadcrumbs);

    // if (nodeType !== 'Program') parentBreadcrumbs.push(_id);
    parentBreadcrumbs.push(_id);

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

    let evalNode = {
      _id,
      nodeType,
      execLevel,
      context,
      parentBreadcrumbs,
      cursor,
      anim,
      _res,
      testAndBlock,
      loopAndBlocks,
      children
    };

    switch (nodeType) {
      case 'Literal':
        _res = node.value;
        break;

      case 'Identifier':
        context[node.name]['isPlaying'] = true; // participating player
        _res = context[node.name]['value']; // no eval needed, just context
        break;

      case 'ExpressionStatement':
        _res = evaluate(node.expression, execLevel, parentBreadcrumbs)._res; // come in last like a good person (eg. VariableDeclaration)
        prevContext = structuredClone(context);
        break;

      case 'ArrayExpression':
        _res = node.elements.map((element) => evaluate(element, execLevel, parentBreadcrumbs)._res);
        break;

      case 'Program':
      case 'BlockStatement':
        evalNode.children = node.body.map((node) => evaluate(node, execLevel, parentBreadcrumbs));
        break;

      case 'VariableDeclaration':
        node.declarations.map((declaration) => {
          let varName = declaration.id.name;
          context[varName] = {
            value: evaluate(declaration.init, execLevel, parentBreadcrumbs)._res,
            isPlaying: true // persists, working
          };
        });
        prevContext = structuredClone(context);
        break;

      case 'UnaryExpression':
        // TODO: copy what Binary does
        // TODO: what if this is not the final test
        const arg = evaluate(node.argument, execLevel, parentBreadcrumbs)._res;

        switch (node.operator) {
          case '!':
            _res = !arg;
          default:
            throw new Error('Unsupported unary operator: ' + node.operator);
        }
        break;

      case 'BinaryExpression':
        // TODO: what if this is not the final test

        const left = evaluate(node.left, execLevel, parentBreadcrumbs);
        const right = evaluate(node.right, execLevel, parentBreadcrumbs);

        _res = binaryOperatorMap[node.operator](left._res, right._res);
        break;

      case 'AssignmentExpression':
        let varName = node.left.name;

        const leftValue = evaluate(node.left, execLevel, parentBreadcrumbs)._res;
        const rightValue = evaluate(node.right, execLevel, parentBreadcrumbs)._res;

        context[varName]['value'] = assignmentOperatorMap[node.operator](leftValue, rightValue);
        context[varName]['isPlaying'] = true; // active (updated) player
        break;

      case 'UpdateExpression':
        varName = node.argument.name;

        context[varName]['value'] = updateOperatorMap[node.operator](context[varName]['value']);
        context[varName]['isPlaying'] = true; // active (updated) player
        break;

      case 'IfStatement':
        let ifBlock;
        let ifTestItem = evaluate(node.test, execLevel, parentBreadcrumbs);

        // of course, a literal If else
        if (ifTestItem._res) {
          ifBlock = evaluate(node.consequent, execLevel, parentBreadcrumbs); // usually a block stmt
        } else if (node.alternate) {
          ifBlock = evaluate(node.alternate, execLevel, parentBreadcrumbs); // usually a block stmt
        }

        testAndBlock.test = ifTestItem;
        testAndBlock.block = ifBlock; // Antipattern for AST: pass over of responsibility to the test node

        break;

      case 'WhileStatement':
        let whileTestItem;
        let whileBlock;
        let whileTestRes = true;

        // of course, a literal while loop
        while (whileTestRes) {
          whileTestItem = evaluate(node.test, execLevel, parentBreadcrumbs);
          whileTestRes = whileTestItem._res;
          if (whileTestRes) {
            whileBlock = evaluate(node.body, execLevel, parentBreadcrumbs);

            loopAndBlocks.testAndBlocks.push({
              test: whileTestItem,
              block: whileBlock // Antipattern for AST: pass over of responsibility to the test node
            });
          } // TODO: Add the last failed test as well
        }

        break;

      case 'CallExpression':
        const callee = node.callee;
        const args = node.arguments.map((arg) => evaluate(arg, execLevel, parentBreadcrumbs)._res);

        if (callee.type === 'MemberExpression') {
          // get console.log() out of the way
          if (callee.object.name === 'console' && callee.property.name === 'log') {
            break;
          }

          const evalalala = evaluate(callee.object, execLevel, parentBreadcrumbs);
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
        const object = evaluate(node.object, execLevel, parentBreadcrumbs)._res;
        const property = node.computed
          ? evaluate(node.property, execLevel, parentBreadcrumbs)._res
          : node.property.name;
        _res = object[property];
        break;

      default:
        throw new Error('Unsupported node type: ' + node.type + ' - ' + JSON.stringify(evalNode));
    }

    if (anim) {
      linearSpoolNodes.push(evalNode);
    }

    evalNode._res = _res;
    return evalNode;
  }

  let justtheone = evaluate(ast);

  return [justtheone, linearSpoolNodes];
  // return [justtheone];
}
