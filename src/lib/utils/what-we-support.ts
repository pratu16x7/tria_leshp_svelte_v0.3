//////////////////
// what we support
//////////////////

// explicit list of what we handle, to be kept adding onto based on the algorithms
// rather than saying what we don't handle
// might make it harder to play around indefintely, but much safer
// if that's what our goal is
// Will be check at the start of parsing every new program input, or change to existing program that a user makes
// Can also have have warnings

export const astNodeTypes = [
  'Literal',
  'Identifier',
  'VariableDeclaration',
  'ExpressionStatement',
  'UnaryExpression',
  'BinaryExpression',
  'ArrayExpression',
  'AssignmentExpression', // woah doesn't have to be a stmt
  'UpdateExpression', // woah doesn't have to be a stmt
  'IfStatement',
  'WhileStatement',
  'BlockStatement',
  'CallExpression',
  'MemberExpression'
];

// TODO: how to use export const type here,
// when you know you want an initial empty value to build upon
// likely make the empty value from scratch, as it's not the job of the type to do that
export const metaBase = {
  players: {},
  relations: {}
};

export const modeBlocksEmpty = { blocksSoFar: [] };
export const bequeathEvalEmpty = { parent: undefined };

// export const spoolItemBase = {
//   _id: '',
//   nodeType: '', // SERIALIZE: this also has it's own meta props to make the full independent spool
//   execLevel: 0,
//   context: {},
//   parentBreadcrumbs: modeBlocksEmpty,
//   interactions: {},
//   literalValue: [],
//   cursor: { start: 0, end: 0 },
//   programPart: '',
//   anim: false
// };

// description, key props

// anim
// top level
// clear players ?
// interactions ? (might need help in code due to nesting)
// token support test / Special preprocess, handling or post process

// SERIALIZE: default values, can be updated during AST evaluation
export const astNodeTypesMeta = {
  // Literal: // just a literal value, // NO IMPORTANCE YET // ['literalValue'].push(node.value);
  Literal: { returns: true, linearSpoolPush: 'before' },

  // Identifier: // is a player (var) from the scope // ['interactions'] = { player: node.name };
  // Where the real eval magic happens: get the context var VALUE not var name
  Identifier: { linearSpoolPush: 'after', returns: true },

  // ExpressionStatement:  // LVL 0
  ExpressionStatement: {
    anim: true,
    contextUpdate: true,
    linearSpoolPush: 'after',
    returns: true
  },

  // Array and Block are siblings

  // ArrayExpression:
  ArrayExpression: { linearSpoolPush: 'before', returns: true },

  // Program
  Program: { linearSpoolPush: 'before' }, // no need to add it to the spool or tree, it is the allfather for now

  // BlockStatement:  // OKAY NOW WE DO // Naa don't wanna give any attention to the block, unless necessary, only to its statements
  BlockStatement: { contextUpdate: true }, // but we return the list of nodes, apart from that doesn't have meaning

  // VariableDeclaration: // Is a new player (var) added to the scope
  // LVL 0
  VariableDeclaration: {
    anim: true,
    contextUpdate: true,
    linearSpoolPush: 'after'
  },

  // UnaryExpression: // is one of the math operations, with a left, right and operator ['interactions'] = { arg, fn: node.operator };
  UnaryExpression: { linearSpoolPush: 'before', returns: true }, // can have token support test: unaryOperatorMap

  // BinaryExpression: ['interactions'] = { left, right, fn: node.operator };
  BinaryExpression: { linearSpoolPush: 'before', anim: true, returns: true }, // can have token support test: binaryOperatorMap

  // Assignment and update are siblings

  // The AssignmentExpression: ['interactions'] = { target: node.left.name, value: assignmentExpressionResult };
  AssignmentExpression: { linearSpoolPush: 'after' }, // woah doesn't have to be a stmt

  // Update expression
  UpdateExpression: { linearSpoolPush: 'after' }, // woah doesn't have to be a stmt

  // If and while are siblings

  // IfStatement: // No ANIM, don't wanna give any attention to the whole block, unless necessary, only to its statements
  IfStatement: { linearSpoolPush: 'after' },

  // WhileStatement: // Similar to handling structure of the 'IfStatement' block
  WhileStatement: { linearSpoolPush: 'before' },

  FunctionDeclaration: { linearSpoolPush: 'after', anim: true },
  CallExpression: { linearSpoolPush: 'before', returns: true },

  MemberExpression: { linearSpoolPush: 'after' }
};

export const unaryOperatorMap = {};

export const binaryOperatorMap = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
  '%': (left, right) => left % right,
  '<': (left, right) => left < right,
  '>': (left, right) => left > right,
  '<=': (left, right) => left <= right,
  '>=': (left, right) => left >= right,
  '==': (left, right) => left == right,
  '===': (left, right) => left === right,
  '!=': (left, right) => left != right,
  '!==': (left, right) => left !== right
  // modulo and others
};

export const assignmentOperatorMap = {
  '=': (leftValue, rightValue) => rightValue,
  '+=': (leftValue, rightValue) => leftValue + rightValue,
  '-=': (leftValue, rightValue) => leftValue - rightValue,
  '*=': (leftValue, rightValue) => leftValue * rightValue,
  '/=': (leftValue, rightValue) => leftValue / rightValue
  // Add other compound operators as needed
};

export const updateOperatorMap = {
  '++': (value) => value + 1,
  '--': (value) => value - 1
};

// TODO: use
export const varTypes = ['number', 'string', 'array'];

// TODO: use
export const functionsSupported = {};

export const LOOP_LIMIT = 20;

// TODO: use
export const arraySizeLimit = 20;

// TODO: use
export const varCountLimit = 7;

// TODO: use
export const callOrRecDepthLimit = 7;

// TODO: use
export const codeLinesLimit = 20;

// console.log('cursor', cursor.programPart, node.expression) // push(), s.substring(i, j), console.log -> type: callexpression, callee.type: memberexpression
// console.log('cursor', cursor.programPart, node.type) // s[j], s.length -> member expression

let memberExpNodeArrayLengthProps = {
  // s.length
  type: 'MemberExpression',
  start: 178,
  end: 186,
  object: { type: 'Identifier', start: 178, end: 179, name: 's' }, // Node
  property: { type: 'Identifier', start: 180, end: 186, name: 'length' }, // Node
  computed: false,
  optional: false
};

let memberExpNodeArrayIndexProps = {
  // s[j] ... Ofcourse for JS [] and . are one and the same
  type: 'MemberExpression',
  start: 363,
  end: 367,
  object: { type: 'Identifier', start: 363, end: 364, name: 's' }, // Node
  property: { type: 'Identifier', start: 365, end: 366, name: 'j' }, // Node
  computed: true,
  optional: false
};

// call s.substring(i, j) Node {
//   type: 'CallExpression',
//   start: 332,
//   end: 349,
//   callee: Node {
//     type: 'MemberExpression',
//     start: 332,
//     end: 343,
//     object: Node { type: 'Identifier', start: 332, end: 333, name: 's' },
//     property: Node {
//       type: 'Identifier',
//       start: 334,
//       end: 343,
//       name: 'substring'
//     },
//     computed: false,
//     optional: false
//   },
//   arguments: [
//     Node { type: 'Identifier', start: 344, end: 345, name: 'i' },
//     Node { type: 'Identifier', start: 347, end: 348, name: 'j' }
//   ],
//   optional: false
// }
