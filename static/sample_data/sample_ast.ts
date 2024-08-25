const ast1 = {
  type: 'Program',
  start: 0,
  end: 52,
  body: [
    {
      type: 'VariableDeclaration',
      start: 0,
      end: 10,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: 4,
          end: 9,
          id: {
            type: 'Identifier',
            start: 4,
            end: 5,
            name: 'a'
          },
          init: {
            type: 'Literal',
            start: 8,
            end: 9,
            value: 1,
            raw: '1'
          }
        }
      ],
      kind: 'var'
    },
    {
      type: 'VariableDeclaration',
      start: 11,
      end: 21,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: 15,
          end: 20,
          id: {
            type: 'Identifier',
            start: 15,
            end: 16,
            name: 'b'
          },
          init: {
            type: 'Literal',
            start: 19,
            end: 20,
            value: 2,
            raw: '2'
          }
        }
      ],
      kind: 'var'
    },
    {
      type: 'VariableDeclaration',
      start: 22,
      end: 36,
      declarations: [
        {
          type: 'VariableDeclarator',
          start: 26,
          end: 35,
          id: {
            type: 'Identifier',
            start: 26,
            end: 27,
            name: 'c'
          },
          init: {
            type: 'BinaryExpression',
            start: 30,
            end: 35,
            left: {
              type: 'Identifier',
              start: 30,
              end: 31,
              name: 'a'
            },
            operator: '+',
            right: {
              type: 'Identifier',
              start: 34,
              end: 35,
              name: 'b'
            }
          }
        }
      ],
      kind: 'var'
    },
    {
      type: 'ExpressionStatement',
      start: 37,
      end: 52,
      expression: {
        type: 'CallExpression',
        start: 37,
        end: 51,
        callee: {
          type: 'MemberExpression',
          start: 37,
          end: 48,
          object: {
            type: 'Identifier',
            start: 37,
            end: 44,
            name: 'console'
          },
          property: {
            type: 'Identifier',
            start: 45,
            end: 48,
            name: 'log'
          },
          computed: false,
          optional: false
        },
        arguments: [
          {
            type: 'Identifier',
            start: 49,
            end: 50,
            name: 'c'
          }
        ],
        optional: false
      }
    }
  ],
  sourceType: 'script'
};
