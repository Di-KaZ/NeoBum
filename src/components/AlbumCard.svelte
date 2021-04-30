<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AlbumsInstance } from 'src/Models/Albums';
	import { Button, Card, CardActions, CardSubtitle, CardTitle, Col, Row } from 'svelte-materialify';

	export let album: AlbumsInstance;
</script>

<Card>
	<Row>
		<Col cols={8}>
			<CardTitle>{album.name}</CardTitle>
			<CardSubtitle>placeholder</CardSubtitle>
			<CardActions>
				<Button text on:click={() => goto(`/Albums/${album.id}`)}>View</Button>
			</CardActions>
		</Col>
		<Col cols={4}><img src={album.cover} alt="cover" /></Col>
	</Row>
</Card>

<style>
	img {
		object-fit: cover;
		width: 80%;
		height: 70%;
	}
</style>
