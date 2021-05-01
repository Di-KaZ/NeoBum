<script lang="ts">
  import { Col, Row } from 'svelte-materialify';
  import { fly } from 'svelte/transition';
  import GroupCard from '../components/GroupCard.svelte';
  import Pagination from '../components/Pagination.svelte';
  import { getGroupsAll } from '../services/GroupsService';

  let activePage = 1;
</script>

<h3 class="text-h3 text-center">Groups</h3>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>

<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-start">
      {#await getGroupsAll(activePage) then groups}
        {#each groups as group, idx}
          <Col sm={6} md={4} cols={12}>
            <div in:fly={{ y: 100, delay: (idx * 100) / 2 }}>
              <GroupCard {group} />
            </div>
          </Col>
        {/each}
        {#if !groups.length}
          <h3 class="text-h3 text-center justify-self-center">
            You're at the end of the road my friend !🤷‍
          </h3>
        {/if}
      {/await}
    </Row>
  </Col>
</Row>
<Row class="justify-center">
  <Pagination bind:activePage />
</Row>
