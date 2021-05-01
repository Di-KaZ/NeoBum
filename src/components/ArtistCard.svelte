<script lang="ts">
  import { goto } from '$app/navigation';
  import { mdiMapMarker } from '@mdi/js';
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
  import type { ArtistsInstance } from '../Models/Artists';
  import { getArtistsPays } from '../services/PaysServices';
  import { getArtistStyle } from '../services/StylesService';

  export let artist: ArtistsInstance;
</script>

<Card>
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{artist.name}</CardTitle>
      {#await getArtistStyle(artist)}
        <ProgressLinear class="ma-3" indeterminate />
      {:then style}
        <CardSubtitle class="pl-7">{style ? style.name : ''}</CardSubtitle>
      {/await}
      <div class="pl-7 d-none d-md-block">
        {#await getArtistsPays(artist)}
          <ProgressLinear class="ma-3" indeterminate />
        {:then pays}
          <Chip label outlined>
            <Icon path={mdiMapMarker} />
            <span>{pays.name}</span>
          </Chip>
        {/await}
      </div>
      <CardActions>
        <Button class="pl-7" text on:click={() => goto(`/Albums/${artist.id}`)}>More Info</Button>
      </CardActions>
    </Col>
  </Row>
</Card>
