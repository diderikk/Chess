<script lang="ts">
import Pairing from "../components/Pairing.svelte";
import SwitchContainer from "../components/SwitchContainer.svelte";

</script>

<div>
	<SwitchContainer>
		<Pairing />
	</SwitchContainer>
</div>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
