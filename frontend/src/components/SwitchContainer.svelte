<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let selected: number = 0;
  let hoverOver: number = -1;
  const switchItems: string[] = ["Pairing", "Lobby", "Rooms"];

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
  :global(:root) {
    --height: 75vh;
    --width: 75vh;
  }
  #container {
    margin-top: 20px;
    height: var(--height);
    width: var(--width);
  }
  #child-container {
    height: 100%;
    width: 100%;
    background-color: lightgray;
    border-radius: 7px;
    overflow-y: auto;
    overflow-x: hidden;
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

  @media only screen and (max-width: 900px) {
    :global(:root) {
      --width: 60vh;
      --height: 60vh;
    }
  }

  @media only screen and (max-width: 600px) {
    :global(:root) {
      --width: 50vh;
      --height: 50vh;
    }
  }

  @media only screen and (max-width: 600px) and (max-height: 650px) {
    :global(:root) {
      --width: 65vh;
      --height: 65vh;
    }
  }

  @media only screen and (max-width: 500px) and (max-height: 700px) {
    :global(:root) {
      --width: 55vh;
      --height: 55vh;
    }
  }
  


  @media only screen and (max-width: 900px) and (max-height: 500px) {
    :global(:root) {
      --width: 60vw;
      --height: 60vh;
    }
  }

  @media only screen and (max-width: 900px) and (max-height: 450px) {
    :global(:root) {
      --width: 60vw;
      --height: 66vh;
    }
  }

  @media only screen and (max-width: 450px) {
    :global(:root) {
      --width: 40vh;
      --height: 40vh;
    }
  }

  @media only screen and (max-width: 450px) and (max-height: 800px) {
    :global(:root) {
      --width: 50vh;
      --height: 50vh;
    }
  }

  @media only screen and (max-width: 450px) and (max-height: 650px) {
    :global(:root) {
      --width: 60vh;
      --height: 60vh;
    }
  }
</style>
