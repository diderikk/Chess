<script lang="ts">
  let selected: number = 0;
  let hoverOver: number = -1;
  const switchItems: string[] = ["Pairing", "Lobby"];

  function select(index: number) {
    selected = index;
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
  <slot />
</div>

<style>
  #container {
    height: 75vh;
    width: 75vh;
  }
  #switch {
    width: 100%;
    height: 5vh;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
</style>
