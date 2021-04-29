<script context="module">
	import { Col, Row } from 'svelte-materialify';
	import { getAlbumByName } from '../../services/AlbumsService';

	export async function load({ page }) {
		const album = await getAlbumByName(page.params.name);

		return {
			props: {
				album
			}
		};
	}
</script>

<script lang="ts">
	export let album: any;
</script>

<Row class="justify-center align-center" style="width:100vw;height:calc(100vh - 68px);">
	<Col md={8}>
		<Row class="justify-center">
			<Col class="d-flex flex-column justify-center align-center">
				<img src={album.cover} alt="cover" class="cover elevation-13" />
				{album.name}
			</Col>
			<Col />
		</Row>
	</Col>
</Row>

<style>
	.cover {
		object-fit: cover;
		width: 30vh;
		height: 30vh;
	}
</style>
