<script lang="ts">
  export let program: string;
</script>

<div>
  <textarea bind:value={program} />
</div>

<style>
  textarea {
    width: 300px;
    height: 150px;
  }
</style>
