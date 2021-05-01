<script context="module" lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import type { AlbumsInstance } from '../../Models/Albums';
  import { getAlbumById } from '../../services/AlbumsService';

  export async function load({ page }) {
    const album = await getAlbumById(+page.params.id);

    return {
      props: {
        album
      }
    };
  }
</script>

<script lang="ts">
  export let album: AlbumsInstance;
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
