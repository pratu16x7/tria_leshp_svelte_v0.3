<script lang="ts">
  export let wrappers: string[] = [];
</script>

{#if wrappers.length}
  <svelte:element this={wrappers[0]} {...$$restProps}>
    <svelte:self wrappers={wrappers.slice(1)}>
      <slot />
    </svelte:self>
  </svelte:element>
{:else}
  <slot />
{/if}

<style>
  div {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }

  .border {
    border: 1px solid lightgrey;
    border-radius: 8px;
    margin: 1em 0;
  }
  .current {
    background-color: #fff;
  }
  .test {
    background-color: lightgoldenrodyellow;
  }
</style>
