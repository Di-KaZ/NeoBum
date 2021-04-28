<script lang="ts">
	import { mdiMagnify, mdiMusicBoxMultiple } from '@mdi/js';
	import { AppBar, Button, Icon, TextField } from 'svelte-materialify';

	export let open: () => void;
</script>

<AppBar class="red d-flex pa-1" style="position:sticky;width:100%;top:0">
	<div class="pointer" slot="icon" on:click={open}>
		<Icon path={mdiMusicBoxMultiple} />
	</div>
	<span class="pointer" slot="title" on:click={open}>Neo Bum</span>
	<div style="flex-grow:4" />
	<!-- FIXME WHITE -->
	<TextField flat solo placeholder="Search" class="mt-2" />
	<Button class="white" fab>
		<Icon path={mdiMagnify} />
	</Button>
</AppBar>

<style>
	.pointer {
		cursor: pointer;
	}
</style>
