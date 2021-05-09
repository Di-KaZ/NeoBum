<script lang="ts">
  import { goto } from '$app/navigation';
  import * as mdi from '@mdi/js';
  import { onMount } from 'svelte';
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
  import { fly } from 'svelte/transition';
  import { getColors } from '../colorthief';
  import { getAlbumGroupOrArtist, getAlbumStyle } from '../neo4j';
  import type { AlbumProperties } from '../types/Album';

  export let album: AlbumProperties;
  export let idx: number;
  let img = null;
  let colors: { bgColor?: string; fgColor?: string } = {};
  const goToAlbumPage = () => goto(`/Albums/${album.id}`);

  onMount(() => getColors(img).then((res) => (colors = res)));
</script>

<div in:fly={{ y: 100, delay: (idx * 100) / 2 }}>
  <Card
    shaped
    style={`${
      colors.bgColor
        ? `background: ${colors.bgColor} !important; color: ${colors.fgColor} !important; transition: background ease-in-out .3s`
        : ''
    }`}
  >
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
          <Chip label outlined style={`color: ${colors.fgColor} !important;`}>
            <Icon path={mdi.mdiMusicNoteEighth} />
            {#await getAlbumStyle(album)}
              <ProgressLinear class="ma-3" indeterminate />
            {:then style}
              <span>{style.name}</span>
            {/await}
          </Chip>
          <Chip label outlined style={`color: ${colors.fgColor} !important;`}>
            <span>{album.price}</span><Icon path={mdi.mdiCurrencyEur} />
          </Chip>
        </div>
        <CardActions>
          <Button text on:click={goToAlbumPage}>More info</Button>
        </CardActions>
      </Col>
      <Col cols={4}>
        <img bind:this={img} src={album.cover} alt="cover" />
      </Col>
    </Row>
  </Card>
</div>

<style>
  img {
    object-fit: cover;
    width: 80%;
    height: 70%;
    border-radius: 3px;
  }
</style>
