<script lang="ts">
  import { goto } from '$app/navigation';
  import * as mdi from '@mdi/js';
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
  import { getAlbumGroupOrArtist, getAlbumStyle } from '../neo4j';
  import type { AlbumProperties } from '../types/Album';

  export let album: AlbumProperties;

  const goToAlbumPage = () => goto(`/Albums/${album.id}`);
</script>

<Card shaped class="transition">
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{album.name}</CardTitle>
      {#await getAlbumGroupOrArtist(album)}
        <ProgressLinear class="ma-3" indeterminate />
      {:then group}
        <CardSubtitle class={`pl-7`}
          >{group.name}
          <span class="red-text font-weight-bold">{album.prodYear}</span></CardSubtitle
        >
      {/await}
      <div class="pl-7 d-none d-md-block">
        <Chip label outlined>
          <Icon path={mdi.mdiMusicNoteEighth} />
          {#await getAlbumStyle(album)}
            <ProgressLinear class="ma-3" indeterminate />
          {:then style}
            <span>{style.name}</span>
          {/await}
        </Chip>
        <Chip label outlined>
          <span>{album.price}</span><Icon path={mdi.mdiCurrencyEur} />
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
