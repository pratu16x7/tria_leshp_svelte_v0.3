import { parse } from 'acorn';
import { getRandomId, toType } from './_index';
import {
  binaryOperatorMap,
  assignmentOperatorMap,
  updateOperatorMap,
  astNodeTypesMeta,
  LOOP_LIMIT
} from './what-we-support';

export function getAST(program: string) {
  const ast = parse(program, { ecmaVersion: 2020 });
  return ast;
}

function clearPlayerPlayingState(context) {
  // console.log('=======context', context);
  // console.log('=======values', Object.values(context));
  Object.values(context).map((playerState) => {
    // console.log('-------------------playerState', playerState);
    playerState['isPlaying'] = false;
  });
  return context;
}

const globalFn = {
  parseInt: parseInt,
  parseFloat: parseFloat
  // Add other globalFn functions you want to support
};

export function unspoolExecute(ast, program) {
  let linearSpoolNodes = [];
  let postRunMeta = {
    meta: {
      players: {},
      arrays: [],
      pointers: []
    },
    errors: []
  };

  let prevContext; // so that you don't have to pass it
  // we just update it at the places context is explicitly changes. No reason though, could do it at end of all nodes, no change in behav

  let functionDefinitions = {};

  function evaluate(
    node,
    execLevel: number = -1,
    parentBreadcrumbs: string[] = [],
    localContext = {}
  ) {
    let _id = getRandomId();
    let nodeType = node.type;
    let cursor = {
      start: node.start,
      end: node.end,
      programPart: program.slice(node.start, node.end)
    };
    execLevel += 1;

    // context is kept getting added to throughout (only works on objects not arrays), unlike execLevel which also has to decrease
    // let context = prevContext ? clearPlayerPlayingState(prevContext) : {}; // by reference, hence change reflect in object too
    let context = { ...prevContext, ...localContext };

    context = clearPlayerPlayingState(context);
    parentBreadcrumbs = structuredClone(parentBreadcrumbs);

    // if (nodeType !== 'Program') parentBreadcrumbs.push(_id);
    parentBreadcrumbs.push(_id);

    let anim = nodeType in astNodeTypesMeta && astNodeTypesMeta[nodeType].anim ? true : false;
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

    let varName;

    // console.log('cursor', cursor.programPart, node) // push, call expression

    switch (nodeType) {
      case 'Literal':
        _res = node.value;
        break;

      case 'Identifier':
        context[node.name]['isPlaying'] = true; // participating player
        _res = context[node.name]['value']; // no eval needed, just context
        break;

      case 'ExpressionStatement':
        let expBlock = evaluate(node.expression, execLevel, parentBreadcrumbs); // come in last like a good person (eg. VariableDeclaration)
        // console.log('========CallExpression block', expBlock);
        // HERE COME ALL THE ABANDONED CHILDREN
        // The first: CallExpression
        let expChildNode = node.expression; // can be CallExpression, MemberExpression, ArrayExpression
        if (expChildNode.type === 'CallExpression' && expBlock.children.length > 0) {
          evalNode.children = [expBlock];
        }
        // console.log('cursor', cursor.programPart, node.expression) // node.expression -> push, console.log -> ...type: callexpression, ...callee.type: memberexpression

        _res = expBlock._res;
        prevContext = structuredClone(context);
        break;

      case 'ArrayExpression':
        _res = node.elements.map((element) => evaluate(element, execLevel, parentBreadcrumbs)._res);
        break;

      case 'Program':
      case 'BlockStatement':
        prevContext = structuredClone(context); /// IMPORTANT
        // console.log('========prevContext33333', prevContext);    /// you have the stuff
        evalNode.children = node.body.map((node) => evaluate(node, execLevel, parentBreadcrumbs));
        break;

      case 'VariableDeclaration':
        node.declarations.map((declaration) => {
          varName = declaration.id.name;
          let newPlayerValue = evaluate(declaration.init, execLevel, parentBreadcrumbs)._res;
          let newPlayerType = toType(newPlayerValue);
          context[varName] = {
            value: newPlayerValue,
            isPlaying: true // persists, working
          };
          postRunMeta.meta.players[varName] = {
            type: newPlayerType
          };
          if (newPlayerType === 'array') {
            postRunMeta.meta.arrays.push(varName);
          }
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
            break;
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
        varName = node.left.name;

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
        } else {
          ifBlock = { children: [] };
        }

        testAndBlock.test = ifTestItem;
        testAndBlock.block = ifBlock; // Antipattern for AST: pass over of responsibility to the test node

        break;

      case 'WhileStatement':
        let whileTestItem;
        let whileBlock;
        let whileTestRes = true;

        // and the king ...
        let counter = 0;

        // of course, a literal while loop
        while (whileTestRes) {
          whileTestItem = evaluate(node.test, execLevel, parentBreadcrumbs);
          whileTestRes = whileTestItem._res;
          if (whileTestRes) {
            // node.body is so far always a block statement
            whileBlock = evaluate(node.body, execLevel, parentBreadcrumbs);

            loopAndBlocks.testAndBlocks.push({
              test: whileTestItem,
              index: counter,
              block: whileBlock // Antipattern for AST: pass over of responsibility to the test node
            });
          } // TODO: Add the last failed test as well
          counter++;

          if (counter > LOOP_LIMIT) {
            postRunMeta.errors.push({
              message: `Loop at char ${cursor.start} exceeded max limit. Sorry, I have only supported a loop limit of ${LOOP_LIMIT} for now. Link: __`,
              cursor: cursor
            });
            break; // This is also safeguard for infinite loops
          }
        }

        break;

      case 'FunctionDeclaration':
        const funcName = node.id.name;
        // do we need this or can we just store it in the context? Maybe either is okay? Let's see
        functionDefinitions[funcName] = {
          params: node.params.map((param) => param.name),
          funcyBody: node.body, // node.body is so far always a block statement
          contextAtTimeOfDeclaration: structuredClone(context)
        };
        break;

      case 'CallExpression': // ALL functions: named (identifiers), global, properties, all of em
        const args = node.arguments.map(
          (arg) => evaluate(arg, execLevel, parentBreadcrumbs, localContext)._res
        );

        const callee = node.callee;

        if (callee.type === 'Identifier') {
          const funcName = callee.name;

          // Custom function call
          if (functionDefinitions[funcName]) {
            const funcyData = functionDefinitions[funcName];

            const funcLocalContext = {};
            funcyData.params.forEach((param, index) => {
              funcLocalContext[param] = { value: args[index], isPlaying: true };
            });

            let totalcontext = {
              ...funcyData.contextAtTimeOfDeclaration,
              ...funcLocalContext
            };

            let funcyBlock = evaluate(
              funcyData.funcyBody,
              execLevel,
              parentBreadcrumbs,
              totalcontext
            );

            evalNode.children = [funcyBlock];
            _res = funcyBlock._res;
            //
          } else if (typeof globalFn[funcName] === 'function') {
            // Global function call
            _res = globalFn[funcName](...args);
          } else {
            throw new Error('Unsupported function: ' + funcName);
          }
        } else if (callee.type === 'MemberExpression') {
          // Properties, but also functions
          // s.push, s.substring, console.log -> callee.type: member expression

          // Handle method calls (existing code)
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
        } else {
          throw new Error('Unsupported callee type: ' + callee.type);
        }
        break;

      case 'ReturnStatement':
        _res = node.argument
          ? evaluate(node.argument, execLevel, parentBreadcrumbs, localContext)._res
          : undefined;
        break;

      case 'MemberExpression': // Properties, not functions | s[j], s.length -> member expression
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

  return [justtheone, linearSpoolNodes, postRunMeta];
  // return [justtheone];
}
