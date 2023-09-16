<script lang="ts">
  import type { NavigateFn } from "svelte-navigator";

  export let navigate: NavigateFn = null;

  function handleClick() {
    navigate("/");
  }
</script>

<div>
  <div>
    <h1 on:click={() => handleClick()}>404</h1>
    <h3>Room Not Found</h3>
  </div>
</div>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
	h1 {
		cursor: pointer;
	}
  h1:hover {
    color: blue;
  }

  h3:focus {
    outline: none;
  }

  h1:focus {
    outline: none;
  }
</style>
