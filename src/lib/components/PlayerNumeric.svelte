<script>
  export let name = ''; // Variable name
  export let number = 0;
  export let color = 'blue'; // Default color
  export let active = true; // Active state control
</script>

<div class="container" style="--opacity: {active ? '1' : '0.2'}">
  <span class="var-name">{name}</span>
  <div class="number-box" style="--bg-color: {color}">
    {number}
  </div>
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    opacity: var(--opacity);
  }
  .number-box {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    background-color: var(--bg-color);
    border-radius: 4px;
    margin-left: 8px; /* Space between name and box */
  }
  .var-name {
    font-size: 14px;
    color: black;
  }
</style>
