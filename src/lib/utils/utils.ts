export function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

// what we support
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

// https://stackoverflow.com/a/7390612/6495043
export function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

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

export const getRandomId = () => {
  let id = 'id' + Math.random().toString(16).slice(2);
  // let id = crypto.randomUUID(); // chrome > 92 and only in HTTPS  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
  return id;
};
