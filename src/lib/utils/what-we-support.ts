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

export const spoolItemBase = {
  _id: '',
  nodeType: '', // SERIALIZE: this also has it's own meta props to make the full independent spool
  execLevel: 0,
  context: {},
  modeBlocks: modeBlocksEmpty,
  interactions: {},
  literalValue: [],
  cursor: { start: 0, end: 0 },
  programPart: '',
  topLevel: false,
  anim: false
};

// description, key props

// anim
// top level
// clear players ?
// interactions ? (might need help in code due to nesting)
// token support test / Special preprocess, handling or post process

// SERIALIZE: default values, can be updated during AST evaluation
export const astNodeTypesMeta = {
  // case 'Literal': // just a literal value, // NO IMPORTANCE YET // ['literalValue'].push(node.value);
  Literal: {},

  // case 'Identifier': // is a player (var) from the scope // ['interactions'] = { player: node.name };
  Identifier: { spoolPush: 'after' },

  // case 'VariableDeclaration': // Is a new player (var) added to the scope
  // LVL 0
  VariableDeclaration: { anim: true, topLevel: true, clearPlayers: true, spoolPush: 'after' },

  // case 'ExpressionStatement':  // LVL 0
  ExpressionStatement: { anim: true, topLevel: true, clearPlayers: true, spoolPush: 'after' },

  // case 'ArrayExpression':
  ArrayExpression: { spoolPush: 'before' },

  // case 'UnaryExpression': // is one of the math operations, with a left, right and operator ['interactions'] = { arg, fn: node.operator };
  UnaryExpression: { spoolPush: 'before' }, // can have token support test: unaryOperatorMap

  // case 'BinaryExpression': ['interactions'] = { left, right, fn: node.operator };
  BinaryExpression: { spoolPush: 'before' }, // can have token support test: binaryOperatorMap

  AssignmentExpression: { spoolPush: 'after' }, // woah doesn't have to be a stmt

  UpdateExpression: { spoolPush: 'after' }, // woah doesn't have to be a stmt

  // case 'IfStatement': // No ANIM, don't wanna give any attention to the whole block, unless necessary, only to its statements
  IfStatement: { topLevel: true, spoolPush: 'before' },

  // case 'WhileStatement': // Similar to handling structure of the 'IfStatement' block
  WhileStatement: { topLevel: true, spoolPush: 'before' },

  // BlockStatement:  // NO IMPORTANCE YET // Naa don't wanna give any attention to the block, unless necessary, only to its statements
  BlockStatement: {},

  CallExpression: { spoolPush: 'after' },

  MemberExpression: {}
};

export const unaryOperatorMap = {};

export const binaryExpressionResultMap = {
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

export const assignmentExpressionMap = {
  '=': (leftValue, rightValue) => rightValue,
  '+=': (leftValue, rightValue) => leftValue + rightValue,
  '-=': (leftValue, rightValue) => leftValue - rightValue,
  '*=': (leftValue, rightValue) => leftValue * rightValue,
  '/=': (leftValue, rightValue) => leftValue / rightValue
  // Add other compound operators as needed
};

export const updateOperatorMap = {};

export const functionsSupported = {};
