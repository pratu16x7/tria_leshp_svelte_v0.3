<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup, minimalSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';
  import { StateField, StateEffect, Range } from '@codemirror/state';
  import { Decoration } from '@codemirror/view';

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

  $: if (editorContainer) {
    editorContainer.innerHTML = '';
    let editorView = new EditorView({
      doc: program,
      extensions: [
        basicSetup,
        javascript(),
        highlight_extension,
        EditorView.theme({
          '&.cm-focused': { outline: 'none' },
          '.cm-gutters': { display: 'none' },
          '.cm-scroller': { paddingLeft: '4px' }
        })
      ],
      // extensions: [],
      parent: editorContainer
    });

    // here is where stuff actually happens

    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: program },
      effects: highlight_effect.of([highlight_decoration.range(cursor.start, cursor.end)])
    });
  }
</script>

<!-- okay not sure anymore how to bind, but we don't need it yet -->
<!-- <textarea bind:value={program} /> -->
<!-- Okay now we do -->
<div bind:this={editorContainer} class="editor"></div>

<style lang="scss">
  .editor {
    width: 300px;
    font-size: 1.1rem;
    height: 100%;
  }
</style>
