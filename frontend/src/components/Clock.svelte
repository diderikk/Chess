<script lang="ts">
  export let playerTime: number = 0;
  export let opponentTime: number = 0;

  function addLeadingZero(number: number) {
    if(number < 10) return `0${number}`
    return number.toString()
  }

  function formatTime(time: number) {
    return `${addLeadingZero(Math.trunc(time/60))}:${addLeadingZero(time%60)}`
  }
</script>

<div id="container">
  <div class="row">
    <h3>Anonymous</h3>
    <h3>{formatTime(opponentTime)}</h3>
  </div>
  <div class="row">
    <h3>Anonymous</h3>
    <h3>{formatTime(playerTime)}</h3>
  </div>
</div>

<style>
  #container {
    height: 25vh;
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
		background-color: rgb(170, 196, 170);
    margin: 0 10px;
    padding: 10px 30px;
  }

  .row {
    width: 100%;
    display: flex;
    justify-content: space-between
  }
</style>
