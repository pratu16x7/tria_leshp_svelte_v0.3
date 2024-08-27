//////////////////
// what we support
//////////////////

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
//   modeBlocks: modeBlocksEmpty,
//   interactions: {},
//   literalValue: [],
//   cursor: { start: 0, end: 0 },
//   programPart: '',
//   topLevel: false,
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
  // Program
  Program: { linearSpoolPush: 'before' }, // no need to add it to the spool or tree, it is the allfather for now

  // Literal: // just a literal value, // NO IMPORTANCE YET // ['literalValue'].push(node.value);
  Literal: { returns: true, linearSpoolPush: 'before' },

  // Identifier: // is a player (var) from the scope // ['interactions'] = { player: node.name };
  // Where the real eval magic happens: get the context var VALUE not var name
  Identifier: { linearSpoolPush: 'after', returns: true },

  // ExpressionStatement:  // LVL 0
  ExpressionStatement: {
    anim: true,
    topLevel: true,
    contextUpdate: true,
    linearSpoolPush: 'after',
    returns: true
  },

  // Array and Block are siblings

  // ArrayExpression:
  ArrayExpression: { linearSpoolPush: 'before', returns: true },

  // BlockStatement:  // OKAY NOW WE DO // Naa don't wanna give any attention to the block, unless necessary, only to its statements
  BlockStatement: {},

  // VariableDeclaration: // Is a new player (var) added to the scope
  // LVL 0
  VariableDeclaration: {
    anim: true,
    topLevel: true,
    contextUpdate: true,
    linearSpoolPush: 'after'
  },

  // UnaryExpression: // is one of the math operations, with a left, right and operator ['interactions'] = { arg, fn: node.operator };
  UnaryExpression: { linearSpoolPush: 'before', returns: true }, // can have token support test: unaryOperatorMap

  // BinaryExpression: ['interactions'] = { left, right, fn: node.operator };
  BinaryExpression: { returns: true }, // can have token support test: binaryOperatorMap

  // Assignment and update are siblings

  // The AssignmentExpression: ['interactions'] = { target: node.left.name, value: assignmentExpressionResult };
  AssignmentExpression: { linearSpoolPush: 'after' }, // woah doesn't have to be a stmt

  // Update expression
  UpdateExpression: { linearSpoolPush: 'after' }, // woah doesn't have to be a stmt

  // If and while are siblings

  // IfStatement: // No ANIM, don't wanna give any attention to the whole block, unless necessary, only to its statements
  IfStatement: { topLevel: true, linearSpoolPush: 'after' },

  // WhileStatement: // Similar to handling structure of the 'IfStatement' block
  WhileStatement: { topLevel: true, linearSpoolPush: 'before' },

  CallExpression: { linearSpoolPush: 'before', returns: true },

  MemberExpression: {}
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

export const functionsSupported = {};
