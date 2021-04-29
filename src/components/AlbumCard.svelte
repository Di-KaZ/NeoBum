<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AlbumsInstance } from 'src/Models/Albums';
	import { Button, Card, CardActions, CardSubtitle, CardTitle } from 'svelte-materialify';

	export let album: AlbumsInstance;
</script>

<Card class="red">
	<img src={album.cover} alt="cover" />
	<CardTitle>{album.name}</CardTitle>
	<CardSubtitle>palceholder</CardSubtitle>
	<CardActions>
		<Button text on:click={() => goto(`/Albums/${album.name}`)}>More Info</Button>
	</CardActions>
</Card>

<style>
	img {
		object-fit: cover;
		width: 100%;
		height: auto;
	}
</style>
