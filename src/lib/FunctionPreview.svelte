<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { esLint, javascript } from '@codemirror/lang-javascript';
  import { EditorState, StateField, StateEffect, Range } from '@codemirror/state';
  import { Decoration } from '@codemirror/view';
  import { linter, lintGutter } from '@codemirror/lint';
  import Linter from 'eslint4b-prebuilt';

  export let program: string;
  export let cursor: { start: number; end: number };
  export let debounceState = false;
  let editorView: EditorView;
  let startState: EditorState;
  let editorContainer: HTMLElement;
  let previousProgram = program;

  let timer;
  const debouncedProgramUpdate = (new_value) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      program = new_value;
      debounceState = false;
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
          debouncedProgramUpdate(update.state.doc.toString());
          previousProgram = program;
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
    width: 300px;
    font-size: 1.1rem;
    height: 100%;
  }
</style>
