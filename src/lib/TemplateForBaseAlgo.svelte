<script>
  export let firstLine;
</script>

<div class="template">
  <p>{firstLine}</p>
  <slot></slot>
</div>

<style>
  .template {
    height: 300px;
  }
</style>
