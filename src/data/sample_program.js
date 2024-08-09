export const sampleProgram3 = `function example() {
  console.log('Hello, world!');
}`;

export const sampleProgram2 = `var a = 1;
var b = 2;
var c = a + b;
console.log(c);`;

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
