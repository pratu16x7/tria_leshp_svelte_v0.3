<script>
  export let firstLine;
</script>

<div class="template">
  <p>{firstLine}</p>
  <slot></slot>
</div>

<style>
  .template {
    height: 500px;
  }
</style>
