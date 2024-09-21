<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { esLint, javascript } from '@codemirror/lang-javascript';
  import { EditorState, StateField, StateEffect, Range } from '@codemirror/state';
  import { Decoration } from '@codemirror/view';
  import { linter, lintGutter } from '@codemirror/lint';
  import Linter from 'eslint4b-prebuilt';

  import { getSyntaxErrors, getPreRunMeta } from '../utils/program-preprocessor';

  export let program: string;
  export let cursor: { start: number; end: number };
  export let debounceState = false;
  export let syntaxErrorsMessages = [];
  syntaxErrorsMessages = syntaxErrorsMessages;
  export let preRunMeta = {};
  let editorView: EditorView;
  let startState: EditorState;
  let editorContainer: HTMLElement;
  let previousProgram = program;

  // one more linter apart from the one passed to codemirror below,
  // Just for getting the errors easily, instead of having to go into the
  // state and view of the editor.
  // BECAUSE => Wasn't able to get diagnostics with an external editor
  const eslint = new Linter();

  let timer;
  const debouncedProgramUpdate = (new_program_value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounceState = false;
      syntaxErrorsMessages = getSyntaxErrors(eslint, new_program_value);

      if (!syntaxErrorsMessages.length) {
        previousProgram = program;
        program = new_program_value;

        // Cool I accept your program as logically, but now I need to check it against what I support.
        // both without running it and running it

        preRunMeta = getPreRunMeta(new_program_value);
      }
    }, 500);
  };

  const highlight_effect = StateEffect.define<Range<Decoration>[]>();

  const highlight_extension = StateField.define({
    create() {
      return Decoration.none;
    },
    update(value, transaction) {
      value = value.map(transaction.changes);

      for (let effect of transaction.effects) {
        if (effect.is(highlight_effect)) {
          // Clear previous highlights (.none) and add new ones
          value = Decoration.none.update({ add: effect.value, sort: true });
        }
      }

      return value;
    },
    provide: (f) => EditorView.decorations.from(f)
  });

  const highlight_decoration = Decoration.mark({
    attributes: { style: 'background-color: aquamarine;' }
  });

  startState = EditorState.create({
    doc: program,
    extensions: [
      basicSetup,
      javascript(),
      highlight_extension,
      EditorView.theme({
        '&.cm-focused': { outline: 'none' },
        '.cm-gutters': { display: 'none' },
        '.cm-scroller': { paddingLeft: '4px' }
      }),
      // lintGutter(),
      linter(esLint(new Linter())),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          // program = update.state.doc.toString();
          debounceState = true;
          let newProgram = update.state.doc.toString();
          debouncedProgramUpdate(newProgram);
        }
      })
    ]
  });

  onMount(() => {
    editorView = new EditorView({
      state: startState,
      parent: editorContainer
    });
  });

  $: if (editorView) {
    // here is where stuff actually happens

    editorView.dispatch({
      effects: highlight_effect.of([highlight_decoration.range(cursor.start, cursor.end)])
    });
  }
</script>

<div bind:this={editorContainer} class="editor"></div>

<style lang="scss">
  .editor {
    width: 400px;
    // font-size: 1rem;
    height: 100%;
  }
</style>
