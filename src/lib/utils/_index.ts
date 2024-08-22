export function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}
// https://stackoverflow.com/a/7390612/6495043
export function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

export const getRandomId = () => {
  let id = 'id' + Math.random().toString(16).slice(2);
  // let id = crypto.randomUUID(); // chrome > 92 and only in HTTPS  // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
  return id;
};
