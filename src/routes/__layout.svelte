<script lang="ts">
  export let title = 'Algorithm Runner';
</script>

<header>
  <h1>{title}</h1>
  <slot name="nav"></slot>
</header>

<main>
  <slot></slot>
</main>

<style>
  header {
    background-color: #f8f8f8;
    padding: 1em;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  nav ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 1em;
  }

  nav ul li {
    display: inline;
  }

  nav ul li a {
    text-decoration: none;
    color: #333;
  }
</style>
