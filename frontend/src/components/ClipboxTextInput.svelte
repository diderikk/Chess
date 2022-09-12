<script lang="ts">
	import CopyToClipboardIcon from "../assets/copy.png"
	
	export let text: string;
	let ref: HTMLInputElement;

	function handleCopyToClipboard() {
		navigator.clipboard.writeText(text)
		ref.select()

	}

	function selectInputText() {
		ref.select()
	}
</script>

<div id="container">
	<input bind:value={text} bind:this={ref} on:focus={selectInputText} readonly />
	<div id="clipboard-button" on:click={handleCopyToClipboard}>
		<img class="icon" src={CopyToClipboardIcon} alt="copy to clipboard icon" />
	</div>
</div>

<style>
	#container {
		height: 15%;
		display: flex;
		align-items: center;
	}
	#clipboard-button{
		height: 100%;
		width: 20%;
		border-radius: 0 7px 7px 0;
		background-color: green;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#clipboard-button:hover{
		background-color: rgba(0, 128, 0, 0.8);
	}
	input {
		height: 100%;
		width: 80%;
		border-radius: 7px 0 0 7px;
		font-size: 1.1rem;
		margin: 0;
	}
	input:focus{
		outline: none;
	}
	.icon {
		width: 2rem;
		height: 2rem;
	}
</style>