<script context="module" lang="ts">
  import { goto } from '$app/navigation';
  import * as mdi from '@mdi/js';
  import type { AlbumProperties } from 'src/types/Album';
  import type { ArtistProperties } from 'src/types/Artist';
  import type { GroupProperties } from 'src/types/Group';
  import type { StyleProperties } from 'src/types/Style';
  import { Card, Chip, Col, Icon, Row } from 'svelte-materialify';
  import { getAlbumGroupOrArtist, getAlbumStyle, getById, getMemberOfGroup } from '../../neo4j';
  export async function load({ page }) {
    const album: AlbumProperties = await getById('Album', +page.params.id);
    const artists = await getAlbumGroupOrArtist(album);
    const style = await getAlbumStyle(album);

    let members = [];

    if (artists.label === 'Group') {
      members = await getMemberOfGroup(artists);
    }

    return {
      props: {
        album,
        artists,
        style,
        members
      }
    };
  }
</script>

<script lang="ts">
  export let album: AlbumProperties;
  export let artists: ArtistProperties | GroupProperties;
  export let style: StyleProperties;
  export let members: ArtistProperties[];
</script>

<Row class="justify-center align-center" style="width:100vw;height:calc(100vh - 68px);">
  <Col md={10}>
    <Card>
      <Row class="pa-15">
        <Col class="d-flex flex-column justify-center align-center">
          <img src={`/albumArts/${album.id}.jpg`} alt="cover" class="cover elevation-13" />
          <p class="font-weight-medium text-h3 pa-5">
            {album.name}
          </p>
        </Col>
        <Col class="d-flex flex-column justify-center align-left">
          {#if artists.label === 'Artist'}
            <h4>Artist : {artists.name}</h4>
          {:else}
            <h4>Group : {artists.name}</h4>
            <Row class="pt-6">
              {#each members as member}
                <Chip
                  outlined
                  class="chip ma-2"
                  style="cursor: pointer;"
                  on:click={() => goto(`/Artists/${member.id}`)}
                >
                  <Icon path={mdi.mdiAccount} />
                  <span class="pointer">{member.name}</span>
                </Chip>
              {/each}
            </Row>
          {/if}
          <Row>
            <Chip label outlined size="large" class="ma-2">
              <Icon path={mdi.mdiMusicNoteEighth} />
              <span>{style.name}</span>
            </Chip>
            <Chip label outlined size="large" class="ma-2">
              <span>{album.price}</span><Icon path={mdi.mdiCurrencyEur} />
            </Chip>
          </Row>
        </Col>
      </Row>
    </Card>
  </Col>
</Row>

<style>
  .cover {
    object-fit: cover;
    width: 30vh;
    height: 30vh;
  }
  .pointer {
    cursor: pointer;
  }
</style>
