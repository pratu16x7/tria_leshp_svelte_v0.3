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
  nodeType: '',
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

// anim
// top level
// clear players ?
//
export const astNodeTypesMeta = {
  Literal: {},
  Identifier: {},
  VariableDeclaration: {},
  ExpressionStatement: {},
  UnaryExpression: {},
  BinaryExpression: {},
  ArrayExpression: {},
  AssignmentExpression: {}, // woah doesn't have to be a stmt
  UpdateExpression: {}, // woah doesn't have to be a stmt
  IfStatement: {},
  WhileStatement: {},
  BlockStatement: {},
  CallExpression: {},
  MemberExpression: {}
};

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
