<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';
  import { EditorState, StateField, StateEffect, Range } from '@codemirror/state';
  import { SearchCursor } from '@codemirror/search';
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
    attributes: { style: 'background-color: yellow' }
  });

  onMount(() => {
    let state = EditorState.create({ /* ... */ extensions: [highlight_extension] });

    let editorView = new EditorView({
      state,
      doc: program,
      // extensions: [basicSetup, javascript(), highlight_extension],
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
    editorContainer.innerHTML = '';
    let editorView = new EditorView({
      doc: program,
      extensions: [basicSetup, javascript(), highlight_extension],
      // extensions: [],
      parent: editorContainer
    });

    // console.log('========cursor', cursor);

    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: program },
      // effects: highlight_effect.of([highlight_decoration.range(cursor.value.from, cursor.value.to)])
      // effects: highlight_effect.of([highlight_decoration.range(10, 30)]),
      effects: highlight_effect.of([highlight_decoration.range(cursor.start, cursor.end)])
    });
  }
</script>

<p>okay not sure anymore how to bind, but we don't need it yet</p>
<div bind:this={editorContainer} class="editor"></div>

<!--<script lang="ts">
  export let program: string;
</script>

<div>
  <p> wow bind works child to parent ... (go to +page.svelte) </p>
  <textarea bind:value={program} />
</div>

<style>
  textarea {
    width: 300px;
    height: 150px;
  }
</style> -->

<style>
  .editor {
    /* height: 100%; */
    width: 100%;
    border: 1px solid #ddd;
  }
  /* .CodeMirror {
    height: 100%;
  } */
</style>
