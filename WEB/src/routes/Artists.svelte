<script lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import { fly } from 'svelte/transition';
  import ArtistCard from '../components/ArtistCard.svelte';
  import Pagination from '../components/Pagination.svelte';
  import { getPage } from '../neo4j';
  import { searchStore } from '../searchStore';

  let activePage = 1;
</script>

<h3 class="text-h3 text-center">Artists</h3>

<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-start">
      {#await getPage('Artist', activePage, 14, { name: $searchStore }) then artists}
        {#each artists as artist, idx}
          <Col sm={6} md={4} cols={12}>
            <div in:fly={{ y: 100, delay: (idx * 100) / 2 }}>
              <ArtistCard {artist} />
            </div>
          </Col>
        {/each}
        {#if !artists.length}
          <h3 class="text-h3 text-center">You're at the end of the road my friend !🤷‍</h3>
        {/if}
      {/await}
    </Row>
  </Col>
</Row>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
