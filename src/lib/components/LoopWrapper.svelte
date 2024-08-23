<script lang="ts">
  export let wrappers: string[] = [];
</script>

{#if wrappers.length}
  <div class="border current dont-display" class:display={wrappers.length >= 1}>
    <div class="border current dont-display" class:display={wrappers.length >= 2}>
      <div class="border current dont-display" class:display={wrappers.length >= 3}>
        <div class="border current dont-display" class:display={wrappers.length >= 4}></div>
      </div>
    </div>
  </div>
{/if}

<style>
  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }
  .current {
    background-color: #fff;
  }

  .dont-display {
    opacity: 0.1;
    position: relative;
    min-height: 100px;
  }

  .display {
    opacity: 1;
  }

  .test {
    background-color: lightgoldenrodyellow;
  }
</style>
