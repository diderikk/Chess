<script lang="ts">
  import type MinuteIncrement from "../types/MinuteIncrement.type";

  const defaultMinuteIncrements: MinuteIncrement[] = [
    { minutes: 1, increment: 0 },
    { minutes: 2, increment: 1 },
    { minutes: 3, increment: 0 },
    { minutes: 3, increment: 2 },
    { minutes: 5, increment: 0 },
    { minutes: 5, increment: 3 },
    { minutes: 10, increment: 0 },
    { minutes: 10, increment: 5 },
    { minutes: 15, increment: 10 },
    { minutes: 30, increment: 0 },
    { minutes: 30, increment: 20 },
  ];

  function getTimeControlMode(timeControl: MinuteIncrement): string {
    if (timeControl.minutes < 3) return "Bullet";
    if (timeControl.minutes < 10) return "Blitz";
    if (timeControl.minutes < 30) return "Rapid";

    return "Classical";
  }
</script>

<div class="container">
  {#each defaultMinuteIncrements as minuteIncrement}
    <div class="time-control">
      <h2 readonly>{`${minuteIncrement.minutes} + ${minuteIncrement.increment}`}</h2>
			<h5 readonly>{getTimeControlMode(minuteIncrement)}</h5>
    </div>
  {/each}
	<div class="time-control">
		<h4 readonly>Custom</h4>
	</div>
</div>

<style>
  .container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    column-gap: 8px;
    row-gap: 8px;
		font-size: x-large;
  }
  .time-control {
    height: 100%;
    width: 100%;
    background-color: darkgray;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
		border-radius: 7px;
		border: 1px solid lightgray;
		cursor: pointer;
  }
	.time-control:hover{
		background-color: green;
	}
	h2{
		margin: 10px;
		user-select: none;
	}
	h5 {
		margin: 0;
		user-select: none;
	}
</style>
