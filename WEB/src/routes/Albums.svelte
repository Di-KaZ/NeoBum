<script lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import { fly } from 'svelte/transition';
  import AlbumCard from '../components/AlbumCard.svelte';
  import Pagination from '../components/Pagination.svelte';
  import { getPage } from '../neo4j';
  import { searchStore } from '../searchStore';

  let activePage = 1;
</script>

<h3 class="text-h3 text-center">Albums</h3>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-center">
      {#await getPage('Album', activePage, 14, { name: $searchStore }) then albums}
        {#each albums as album, idx}
          <Col xl={5} md={6} cols={12}>
            <div in:fly={{ y: 100, delay: (idx * 100) / 2 }}>
              <AlbumCard {album} />
            </div>
          </Col>
        {/each}
        {#if !albums.length}
          <h3 class="text-h3 text-center">You're at the end of the road my friend !🤷‍</h3>
        {/if}
      {/await}
    </Row>
  </Col>
</Row>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
