<script>
  export let totalSteps = 100;
  export let completedSteps = 0;
  export let color = '#ff526f'; /* Intense Pink */

  $: progressPercentage = (completedSteps / totalSteps) * 100;
</script>

<div class="progress-bar">
  <div class="progress" style="width: {progressPercentage}%; background-color: {color};"></div>
</div>

<style>
  .progress-bar {
    width: 100%;
    height: 3px;
    background-color: #d3d3d3; /* Light grey */
    overflow: hidden;
  }

  .progress {
    height: 100%;
    transition: width 0.3s ease-in-out;
  }
</style>
