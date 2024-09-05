<!-- Using this for multiple demos will demonstrate how fliexible your own code is -->
<!-- But making different demo components will demo how lovely you story is -->
<!-- Let's just make a wrapper around this for now to try get best of both -->
<!-- The solution will have to be some kind of middle gorund anyway, -->
<!-- we want the keybinding and all, but also want the customization -->

<script lang="ts">
  import FunctionPreview from '../lib/components/FunctionPreview.svelte';
  import SpoolItem from '../lib/components/SpoolItem.svelte';
  import { getAST, unspoolExecute } from '../lib/utils/ast';
  import State from './components/State.svelte';
  import { meta } from '../data/sample_meta_2';

  export let program: string;
  export let demoType: string = 'just-anim';
  let debounceState = false;
  let syntaxErrorState;
  let programSupportState = false; // WIP

  let syntaxErrorsMessages = [];
  syntaxErrorsMessages = syntaxErrorsMessages;

  $: syntaxErrorState = syntaxErrorsMessages.length > 0 ? true : false;

  let origProgram = program;

  // WIP: Barricade, error handling, don't navigate beyond upper and lower indexes
  $: index = 0;

  $: ast = getAST(program);
  $: [justtheone, nodeEvalList] = unspoolExecute(ast, program);
  $: currSpoolItem = nodeEvalList[index];
  $: ({ _id, cursor, context, parentBreadcrumbs } = currSpoolItem);

  $: astNode = ast.body;
  $: currentAstNodeItem = astNode[index] || '';

  function onKeyDown(e) {
    switch (e.keyCode) {
      case 38: // up
        index -= 1;
        break;
      case 40: // down
        index += 1;
        break;
      case 37: // left
        index -= 1;
        break;
      case 39: // right
        index += 1;
        break;
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="box flex" class:large-box={demoType === 'minimap'}>
  <!-- TODO:
- [x] Dump all
- [x] more style: only program should show, fix horizontal size
  - [x] more style fixes, ask claude for help
- [x] simplify implementation: move into onmount, rm dead code

- [ ] HARD editable program: BIND THE PROGRAM, so when we change it, things happen:
  - [x] oh okay the obchange thingy worked
  - OKAY THIS IS THE CORE OF TRIALGO, think think the UX ...
    - Actually, no not necessary to get it bang the first go you can keep improving it. But good to realize the enormity nonetheless.
    - [x] svelte doesn't need deboucing right?
    - [x] oh wait first fix typing cursor issue
      - TODO cursor moves to start after update, even when removing bind from parent, will have to make it a single flow from the top
      - [x] try rm bind:  not working
      - [x] okay rm the changes dispatch, rm it, and don't rm bind. Typing Cursor doesn't reset now, woo!
      - [x] but now the highlight persists, rm it, asked Claude, works now, Just a tiny None!
    - UX not performance: debounce vs constantly refreshing with each key stroke- I think debounce will look nicer.
      - Yeah something like Copepen also agrees. And what do we want to show them?
        -  just the last animation during the debounce period of course
        - [x] Implemement Debounce: where the three levels of handlers aren't even started

  - Set up FOUR levels of handlers:
    - 1. debounce state(done),
      -  ANd when you have or still have an error, what does codepen do? It has nice html css still so it doesn't need to worry
      - we on the other hand, need to show something in the animation pane on an error, and just have the last animation
      - Let go with an empty state instead of old animation, and we'll think what to fill in it later
          - Saying something like "Waiting for program input" probably ain't it
          - [x] add debounce state variable
          - and then, well, do nothing, just keep anim at the prev state for those few milliseconds
            - like codemirror does and if things don't get better only then do something
            - those few milliseconds are not the place to give any feedback, that would be too overwhelming.
              - Not worth it, not interesting and just overheady

You have to start making a component of this now btw
- [x] take out this first one, and change program -> program
- [x] 3 demos using it


    - 2. syntax wrong state, program invalid:
      - okay first: is there an error? boolean state to bubble up
          - [x] Tried, Okay you can't: https://discuss.codemirror.net/t/best-way-to-check-if-a-syntax-tree-contains-errors/7441
          - [x] put in a linter for showing errors in the editor
          - [x] put in another linter to touch the errors
            - [x] pass them over to parent to use
            - [ ] disable the animation using this passed bound error
      - econd, what is the error? No need to bubble up just show below program itself and link for mor einfor
        - and show something in the program pane to indicate error using codemirror's diagnostic. Thank god for codemirror.
          - [x] lvl2: detailed erorr messages using external linter ... DONE using external linter!
              - https://discuss.codemirror.net/t/codemirror-6-customize-linter/8211, https://discuss.codemirror.net/t/handling-error-states/2551/9

	work on 3, 4 point later, much of the main framework in place likely

- [ ] HARD fix animation
	- [ ] meta work
      - [ ] multiple pointers work
      - [ ] substring work
    - [ ] make it absolutely positioned
    - [ ] _
    - [ ] rm headings, better loop representation
    - [ ] juudge the number of loops
    - [ ] ...list more edge cases to test later
    - [ ] list more
      - [ ] more player components
- [ ] select a program: maybe uncompress


    - [ ] 3. not supported/guardrail state,
      - [ ] Show error (different color probably, like pink) and link for mor einfor
		- [ ] disables the animation
	  - [ ] handle supports
		- [ ] show excatly what the error is

    - [ ] 4. and if all prev passes: finally new program updated state (this mostly already works, just test agreessively)
        - [ ] makes a new AST
        - [ ] rerenders and restarts animation from the start
        - [ ] rerun automatically with svelte react. GO SVELTE TRULY REACTIVE!
        - [ ] reset highlight
        - [ ] test aggressively, note test cases
          - [ ] test case 1: does the highlight reset?
    - [ ] Reset button that appears when program changed

- [ ] animation progress bar
- [ ] bound check for the index

  -->
  {#if demoType !== 'minimap'}
    <FunctionPreview bind:program {cursor} bind:debounceState bind:syntaxErrorsMessages />

    <div>
      <SpoolItem
        {...justtheone}
        activeId={_id}
        activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="animation"
        {meta}><State {context} {meta} /></SpoolItem
      >
    </div>
  {:else}
    <div>
      <FunctionPreview bind:program {cursor} bind:debounceState bind:syntaxErrorsMessages />
      <SpoolItem
        {...justtheone}
        activeId={_id}
        activeParentBreadcrumbs={parentBreadcrumbs}
        templateType="animation"
        {meta}
      />
    </div>
    <SpoolItem
      {...justtheone}
      activeId={_id}
      activeParentBreadcrumbs={parentBreadcrumbs}
      templateType="tree-minimap"
      {meta}
    />
  {/if}
</div>
<p>{debounceState}, {syntaxErrorState}, {JSON.stringify(syntaxErrorsMessages)}, {program}</p>

<style lang="scss">
  .box {
    border: 1px solid #e3e3e3;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    height: 300px;
  }

  .medium-box {
    height: 450px;
  }

  .large-box {
    height: 600px;
  }

  .box-caption {
    font-size: 0.8em;
    text-align: center;
    margin-top: 10px;
    // color: #7c7c7c;
    margin-bottom: 5rem;
  }
</style>
