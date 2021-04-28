<script lang="ts">
	import { Col, ProgressCircular, Row } from 'svelte-materialify';
	import { fade, fly } from 'svelte/transition';
	import AlbumCard from '../components/AlbumCard.svelte';
	import { getAllbumAll } from '../services/AlbumsService';

	const fetchAlbums = (async () => {
		return await getAllbumAll();
	})();
</script>

<h1 class="text-h1 text-center pa-10">Albums</h1>

<Row class="justify-center">
	<Col md={8}>
		<Row class="justify-center">
			{#await fetchAlbums}
				<div out:fade={{ duration: 1500 }}>
					<ProgressCircular indeterminate color="red" />
				</div>
			{:then albums}
				{#each albums as album, idx}
					<Col md={4} class="pa-2">
						<div in:fly={{ y: idx % 2 ? 200 : -200, duration: 500 }}>
							<AlbumCard {album} />
						</div>
					</Col>
				{/each}
			{/await}
		</Row>
	</Col>
</Row>
