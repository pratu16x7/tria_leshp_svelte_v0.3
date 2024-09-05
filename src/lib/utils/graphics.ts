import { programs } from '../../data/programs/sample_program.js';
import { getAST, unspoolExecute } from './ast.js';
import { meta } from '../../data/sample_meta_2';

// Example algorithm family and program
const sampleFamily = 'test_programs';
const sampleProgram = 'array_1';

export function getGraphic(algorithmFamily = sampleFamily, programName = sampleProgram) {
  let program: string;

  // WIP: Barricade, error handling,
  program = programs[algorithmFamily]?.[programName]?.text || 'Program not found';

  let ast = getAST(program);
  let [justtheone, nodeEvalList] = unspoolExecute(ast, program);

  return [nodeEvalList[nodeEvalList.length - 1].context, meta];
}
