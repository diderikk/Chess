<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let selected: number = 0;
  let hoverOver: number = -1;
  const switchItems: string[] = ["Pairing", "Lobby"];

  function select(index: number) {
    dispatch("select", index);
  }

  function hover(index: number) {
    hoverOver = index;
  }
  function hoverExit() {
    hoverOver = -1;
  }
</script>

<div id="container">
  <div id="switch">
    {#each switchItems as item, index}
      <div
        on:focus={() => {}}
        on:mouseover={() => hover(index)}
        on:mouseleave={hoverExit}
        on:click={() => select(index)}
        class="switch-item"
      >
        <h3 style:color={selected === index ? "green" : ""}>
          {item}
        </h3>
        <div
          class="bar"
          style:background-color={selected === index
            ? "green"
            : hoverOver === index
            ? "green"
            : "darkgray"}
        />
      </div>
    {/each}
  </div>
  <div id="child-container">
    <slot />
  </div>
</div>

<style>
  #container {
    height: 75vh;
    width: 75vh;
  }
  #child-container{
    height: 100%;
    width: 100%;
    background-color: lightgray;
    border-radius: 7px;
  }
  #switch {
    width: 100%;
    height: 5vh;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  }
  .switch-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .bar {
    height: 3px;
    width: 100%;
  }
  h3 {
    margin: 0;
    
  }
  h3:focus {
    outline: none;
  }
</style>
