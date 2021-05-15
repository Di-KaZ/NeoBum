<script lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import AlbumCard from '../components/AlbumCard.svelte';
  import Filter from '../components/Filter.svelte';
  import Pagination from '../components/Pagination.svelte';
  import { getPage } from '../neo4j';
  import { searchStore } from '../searchStore';

  let activePage = 1;
</script>

<h3 class="text-h3 text-center">Albums</h3>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
<Filter options={['name', 'prodYear', 'price']} />
<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-center">
      {#await getPage('Album', activePage, 14, { [`${$searchStore.filterBy}`]: $searchStore.search }, $searchStore.order) then albums}
        {#each albums as album, idx}
          <Col xl={5} md={6} cols={12}>
            <AlbumCard {album} {idx} />
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
