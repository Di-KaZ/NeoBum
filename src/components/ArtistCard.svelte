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
  import { getArtistPays, getArtistStyle } from '../neo4j';
  import type { ArtistProperties } from '../types/Artist';

  export let artist: ArtistProperties;
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
        {#await getArtistPays(artist)}
          <ProgressLinear class="ma-3" indeterminate />
        {:then pays}
          <Chip label outlined>
            <Icon path={mdi.mdiMapMarker} />
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
