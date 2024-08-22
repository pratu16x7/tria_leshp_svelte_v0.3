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

import {
  astNodeTypes,
  binaryExpressionResultMap,
  assignmentExpressionMap
} from './utils/what-we-support';
