export const programs = {
  test_programs: {
    line: {
      text: `let a = 1;`
    },

    variable_declaration: {
      text: `let a = 1;
let b = 2;
let c = a + b;`
    },

    variable_assignment: {
      text: `let a = 1;
a = 2;
let c = a * 2;`
    },

    array_and_push: {
      text: `let a = 1;
let b = 2;
let list = [10, 20, 30];
list.push(40);
let c = a + b;
console.log(c);`
    },

    if: {
      text: `let j = 1;
let num = 5;
if (j > 0) {
  num = 10;
  j = 12;
  let a = 4;
}
console.log("foo")`
    },

    else: {
      text: `let j = 1;
let num = 5;
if (j > 2) {
  num = 10;
  j = 2;
} else {
  num = 7;
}
console.log("foo")`
    },

    while_loop: {
      text: `let j = 0;
let num = 5;
while (j < 3) {
  num += 10;
  j += 1;
}
console.log("foo")`
    },

    array_1: {
      text: `let j = 0;
// let num = 5;
let l = [1,2,3];
while (j < 3) {
  l.push(j);
  j += 1;
}
console.log("foo");`
    },

    array_pointer_1: {
      text: `let j = 0;
let num = 0;
let l = [1,2,3];
while (j < 3) {
  num = l[j];
  j += 1;
}
console.log("foo");`
    },

    function_call: {
      text: `function example() {
  console.log('Hello, world!');
}`
    }
    //   functionCall: {},
    //   functionCall: {},
    //   functionCall: {},
    //   functionCall: {},}
  },

  array_algorithms: {
    // test uncompress raw code
    // test uncompress as function code

    uncompress: {
      text: `let s = "2t3o11g2s";
  let res = "";
  let i = 0;
  let j = 1;
  const digits = "0123456789";
  let num = parseInt(s.substring(i, j));
  // res += s[j].repeat(num);
  res += s[j];
  i = j + 1;
  j++;
  console.log("foo")`
    },
    uncompress_as_function: {
      text: `function uncompress(s) {
      let res = "";
      let i = 0;
      let j = 0;
      const digits = "0123456789";

      while (j < s.length) {
          if (!digits.includes(s[j])) {
              // Convert the substring from i to j into a number and repeat the character s[j]
              const num = parseInt(s.substring(i, j));
              res += s[j].repeat(num);
              i = j + 1; // Move the start pointer past the current character
          }
          j++;
      }

      return res;
  }

  // Example usage
  const compressedString = "3a4b2c";
  console.log(uncompress(compressedString));  // Outputs: aaabbbbcc`
    }
  },

  erroring_programs_to_handle_at_first_meta_check: {
    syntax_err_unknown_symbol: {
      text: `let s = [0,1,2,3];
  // let j = 0;
  let num = j;  // unknown symbol
  while (j < 3) {
    s.push(j);
    j += 1;
  }
  console.log("foo")`
    }
  }
};
