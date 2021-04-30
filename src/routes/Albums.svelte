<script lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import AlbumCard from '../components/AlbumCard.svelte';
  import AlbumsService from '../services/AlbumsService';
</script>

<h3 class="text-h3 text-center">Albums</h3>

<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-center">
      {#await AlbumsService.getAllbumAll() then albums}
        {#each albums as album}
          <Col xl={5} md={6} cols={12}>
            <AlbumCard {album} />
          </Col>
        {/each}
      {/await}
    </Row>
  </Col>
</Row>
