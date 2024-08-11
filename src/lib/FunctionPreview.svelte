<script>
  import { onMount } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';

  export let program;

  let editorContainer;

  onMount(() => {
    let editor = new EditorView({
      doc: program,
      extensions: [basicSetup, javascript()],
      parent: editorContainer,
      readOnly: true
    });

    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: program }
    });

    editor.updateListener = (update) => {
      if (update.changes) {
        program = update.state.doc.toString();
      }
    };
  });

  $: if (editorContainer) {
    editorContainer.innerHTML = '';
    let editor = new EditorView({
      doc: program,
      extensions: [basicSetup, javascript()],
      parent: editorContainer
    });
  }
</script>

<div bind:this={editorContainer} class="editor"></div>

<style>
  .editor {
    height: 100%;
    width: 100%;
    border: 1px solid #ddd;
  }
  /* .CodeMirror {
    height: 100%;
  } */
</style>
