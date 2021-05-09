<script context="module" lang="ts">
  import type { AlbumProperties } from 'src/types/Album';
  import { Col, Row } from 'svelte-materialify';
  import { getById } from '../../neo4j';

  export async function load({ page }) {
    const album = await getById('Album', +page.params.id);
    return {
      props: {
        album
      }
    };
  }
</script>

<script lang="ts">
  export let album: AlbumProperties;
</script>

<Row class="justify-center align-center" style="width:100vw;height:calc(100vh - 68px);">
  <Col md={8}>
    <Row class="justify-center">
      <Col class="d-flex flex-column justify-center align-center">
        <img src={album.cover} alt="cover" class="cover elevation-13" />
        <p class="font-weight-medium text-h3">
          {album.name}
        </p>
      </Col>
      <Col />
    </Row>
    <Row>
      {album.price}
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
