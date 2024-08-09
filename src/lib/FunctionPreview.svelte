<script lang="ts">
  export let program: string;
</script>

<div>
  <!-- wow bind works child to parent ... (go to +page.svelte) -->
  <textarea bind:value={program} />
</div>

<style>
  textarea {
    width: 300px;
    height: 150px;
  }
</style>
