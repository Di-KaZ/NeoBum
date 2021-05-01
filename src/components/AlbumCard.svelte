<script lang="ts">
  import { goto } from '$app/navigation';
  import { mdiCurrencyEur, mdiMusicNoteEighth } from '@mdi/js';
  import {
    Button,
    Card,
    CardActions,
    CardSubtitle,
    CardTitle,
    Chip,
    Col,
    Icon,
    ProgressLinear,
    Row
  } from 'svelte-materialify';
  import type { Album } from '../neo4j';

  export let album: Album;

  const getAlbumGroupOrArtist = async () => Promise.resolve({ name: 'hey' });
  const getAlbumStyle = async () => Promise.resolve({ name: 'hey' });

  const goToAlbumPage = () => goto(`/Albums/${album.id}`);
</script>

<Card shaped class="transition">
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{album.name}</CardTitle>
      {#await getAlbumGroupOrArtist()}
        <ProgressLinear class="ma-3" indeterminate />
      {:then group}
        <CardSubtitle class={`pl-7`}>{group.name}</CardSubtitle>
      {/await}
      <div class="pl-7 d-none d-md-block">
        <Chip label outlined>
          <Icon path={mdiMusicNoteEighth} />
          {#await getAlbumStyle()}
            <ProgressLinear class="ma-3" indeterminate />
          {:then style}
            <span>{album.prodYear}</span>
          {/await}
        </Chip>
        <Chip label outlined>
          <span>{album.price}</span><Icon path={mdiCurrencyEur} />
        </Chip>
      </div>
      <CardActions>
        <Button text on:click={goToAlbumPage}>More info</Button>
      </CardActions>
    </Col>
    <Col cols={4}>
      <img src={album.cover} alt="cover" />
    </Col>
  </Row>
</Card>

<style>
  img {
    object-fit: cover;
    width: 80%;
    height: 70%;
    border-radius: 3px;
  }
</style>
