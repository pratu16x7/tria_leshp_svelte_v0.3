// ---- Point to note, not everything has to be done in the main evaluation AST loop
// ---- soemthings can be a quick parse
// ---- doesn't matter if there's repetitive code, it will be easier to undertsand
// ---- compared to one big massive file

// 1.....check guardings:
// check syntax errors (needs AST)
// check if all nodes supported (needs AST)
// check if all operators supported (needs AST)
// max loop depth etc (needs AST eval)
// max if else depth
// max block depth in general
// max int size (needs AST)
// max string length (needs AST)
// _
// _

// 2.....okay program safe, get meta info
// get meta (player info) (needs AST eval)
// get player relations
// _
// _
// _

import { astNodeTypes, binaryOperatorMap, assignmentOperatorMap } from './what-we-support';

export function getMetaFromLastContextInSpool(context) {}

// export function unspoolExecute(ast, program, fullSpool = [spoolItemBase], meta = metaBase) {
//   let prevFullSpoolItem = structuredClone(fullSpool[fullSpool.length - 1]);
//   function evaluate(
//     node,
//     execLevel = 0,
//     modeBlocks = modeBlocksEmpty,
//     bequeathEval = bequeathEvalEmpty
//   ) {
//     // bequeathEval is used to show you want to focus on the expression which is otherwise not top level
//     let context = prevFullSpoolItem['context'];
//     modeBlocks = structuredClone(modeBlocks);
//     let nodeType = node.type;
//     let cursor = { start: node.start, end: node.end };
//     let programPart = program.slice(cursor.start, cursor.end);

//     let newPlayer = {};
//     let newPlayerMeta = {};

//     switch (nodeType) {
//       // TODO: Also needs to return input parameters, they are also variables

//       case 'VariableDeclaration':
//         for (let declaration of node.declarations) {
//           let varName = declaration.id.name;
//           let varValue = evaluate(declaration.init, execLevel + 1, modeBlocks);
//           newPlayerMeta = {
//             name: varName,
//             type: toType(varValue)
//           };
//           newPlayer = {
//             value: varValue,
//             isPlaying: true // persists, working
//           };
//           meta['players'][varName] = newPlayerMeta;
//           spoolItem['context'][varName] = newPlayer;
//           // spoolItem['newPlayers'][varName] = varValue;
//         }
//         break;

//       default:
//         fullSpool.push(spoolItem);
//         throw new Error('Unsupported node type: ' + node.type);
//     }
//   }

//   for (let node of ast.body) {
//     evaluate(node);
//     // console.log('Context:', spool);
//   }
// }
