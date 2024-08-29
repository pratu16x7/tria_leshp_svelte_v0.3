import { programs } from '../../data/programs/sample_program.js';
import { getAST, unspoolExecute } from './ast.js';

// Example algorithm family and program
const sampleFamily = 'test_programs';
const sampleProgram = 'array_1';

export function getGraphic(algorithmFamily = sampleFamily, programName = sampleProgram) {
  let program: string;

  // WIP: Barricade, error handling,
  program = programs[algorithmFamily]?.[programName]?.text || 'Program not found';

  let ast = getAST(program);
  let [justtheone, nodeEvalList] = unspoolExecute(ast, program);

  // TODO: Big WIP
  let meta = {
    l: {
      pointer_1: 'j'
    }
    // type: symbol array/string or numeric problem?
    // on second thoughr, just assume symbol array is a string

    // substring? -> assume yes is symbol array/string and two pointers?
    // 1 substring and 1 value At? -> mayve let this be default
    // two substrings?
  };

  return [nodeEvalList[nodeEvalList.length - 1].context, meta];
}
