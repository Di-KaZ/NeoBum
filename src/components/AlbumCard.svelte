<script lang="ts">
  import { goto } from '$app/navigation';
  import { mdiCurrencyEur, mdiMusicNoteEighth } from '@mdi/js';
  import { onDestroy, onMount } from 'svelte';
  import {
    Button,
    Card,
    CardActions,
    CardSubtitle,
    CardTitle,
    Chip,
    Col,
    Icon,
    Row
  } from 'svelte-materialify';
  import type { AlbumsInstance } from '../Models/Albums';
  import AlbumsService from '../services/AlbumsService';
  import colorthief, { rgbToHex } from '../services/colorthief';

  export let album: AlbumsInstance;
  let cover;
  let bgColor = '#fff';
  let fgColor = '#000';

  const getBgColor = () => {
    const [r, g, b] = colorthief.getColor(cover);
    bgColor = rgbToHex(r, g, b);
    fgColor = whiteOrBlack();
  };
  onMount(() => {
    cover.crossOrigin = 'Anonymous';
    if (cover.complete) {
      const [r, g, b] = colorthief.getColor(cover);
      bgColor = rgbToHex(r, g, b);
      fgColor = whiteOrBlack();
    } else {
      cover.addEventListener('load', getBgColor);
    }
  });

  onDestroy(() => cover.removeEventListener('load', getBgColor));

  const whiteOrBlack = () =>
    parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';

  const goToAlbumPage = () => goto(`/Albums/${album.id}`);
</script>

<Card
  shaped
  style={`background-color:${bgColor};transition: all 0.3s ease-in-out;color:${fgColor}`}
  class="transition"
>
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{album.name}</CardTitle>
      {#await AlbumsService.getAlbumGroupOrArtist(album) then group}
        <CardSubtitle class={`pl-7`} style={`color:${fgColor}`}>{group.name}</CardSubtitle>
      {/await}
      <div class="pl-7 d-none d-md-block">
        <Chip label class="purple-text">
          <Icon path={mdiMusicNoteEighth} />
          <span>genre</span>
        </Chip>
        <Chip label class="purple-text">
          <span>{album.price}</span><Icon path={mdiCurrencyEur} />
        </Chip>
      </div>
      <CardActions>
        <Button text on:click={goToAlbumPage}>More info</Button>
      </CardActions>
    </Col>
    <Col cols={4}>
      <img bind:this={cover} src={album.cover} alt="cover" />
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
