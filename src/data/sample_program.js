export const sampleProgram3 = `function example() {
  console.log('Hello, world!');
}`;

export const sampleProgram2 = `let a = 1;
let b = 2;
let list = [10, 20, 30];
list.push(40);
let c = a + b;
console.log(c);`;

export const sampleProgram4 = `let res = "";
let s = "2t3o11g2s";
let i = 0;
let j = 1;
const digits = "0123456789";
const num = parseInt(s.substring(i, j));`;

export const sampleProgram = `function uncompress(s) {
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
console.log(uncompress(compressedString));  // Outputs: aaabbbbcc`;
