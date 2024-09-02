<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup, minimalSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';
  import { EditorState, StateField, StateEffect, Range, Compartment } from '@codemirror/state';
  import { SearchCursor } from '@codemirror/search';
  import { Decoration, gutter, lineNumbers } from '@codemirror/view';

  export let program: string;

  export let cursor;

  let editorContainer: Element;
  const highlight_effect = StateEffect.define<Range<Decoration>[]>();

  const highlight_extension = StateField.define({
    create() {
      return Decoration.none;
    },
    update(value, transaction) {
      value = value.map(transaction.changes);

      for (let effect of transaction.effects) {
        if (effect.is(highlight_effect)) value = value.update({ add: effect.value, sort: true });
      }

      return value;
    },
    provide: (f) => EditorView.decorations.from(f)
  });

  const highlight_decoration = Decoration.mark({
    attributes: { style: 'background-color: aquamarine;' }
  });

  let tabSize = new Compartment();

  onMount(() => {
    let state = EditorState.create({
      /* ... */ extensions: [
        highlight_extension
        // tabSize.of(EditorState.tabSize.of(8)),
      ]
    });

    let editorView = new EditorView({
      state,
      doc: program,
      // extensions: [minimalSetup, javascript(), highlight_extension],
      extensions: [highlight_extension],
      parent: editorContainer
    });

    let cursor = new SearchCursor(editorView.state.doc, 'push');

    cursor.next();

    // console.log(program, cursor.value);

    // editorView.updateListener = (update) => {
    //   if (update.changes) {
    //     program = update.state.doc.toString();
    //   }
    // };
  });

  $: if (editorContainer) {
    console.log('minimalSetup', minimalSetup);
    editorContainer.innerHTML = '';
    let editorView = new EditorView({
      doc: program,
      extensions: [minimalSetup, javascript(), highlight_extension],
      // extensions: [],
      parent: editorContainer
    });

    // here is where stuff actually happens

    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: program },
      // effects: highlight_effect.of([highlight_decoration.range(cursor.value.from, cursor.value.to)])
      // effects: highlight_effect.of([highlight_decoration.range(10, 30)]),
      effects: highlight_effect.of([highlight_decoration.range(cursor.start, cursor.end)])
    });
  }
</script>

<!-- <p>okay not sure anymore how to bind, but we don't need it yet</p> -->
<div bind:this={editorContainer} class="editor"></div>

<!-- <textarea bind:value={program} /> -->

<style lang="scss">
  .editor {
    /* height: 100%; */
    /* width: 100%; */
    /* border: 1px solid #ddd; */

    width: 300px;
    font-size: 1.1rem;

    .cm-editor.cm-focused {
      outline: none !important;
    }
    .c1.cm-focused {
      outline: none !important;
    }

    .cm-editor.cm-focused.ͼ1.ͼ2.ͼ4 {
      outline: none !important;

      .cm-gutters {
        display: none !important;
        position: relative !important;
      }

      .cm-scroller .cm-gutters {
        display: none !important;
        position: relative !important;
      }

      .cm-gutters {
        display: none !important;
        position: relative !important;
      }

      .cm-gutter.cm-mygutter {
        display: none !important;
      }
    }
  }
</style>
