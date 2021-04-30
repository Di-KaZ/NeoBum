<script lang="ts">
  import { Col, ProgressCircular, Row } from 'svelte-materialify';
  import { fade } from 'svelte/transition';
  import GroupCard from '../components/GroupCard.svelte';
  import GroupsService from '../services/GroupsService';
</script>

<h1 class="text-h1 text-center pt-10">Groups</h1>

<Row class="justify-center">
  <Col cols={10}>
    <Row class="justify-center">
      {#await GroupsService.getGroupsAll()}
        <Col xl={5} md={6} cols={12}>
          <div out:fade={{ duration: 1500 }}>
            <ProgressCircular indeterminate color="red" />
          </div>
        </Col>
      {:then groups}
        {#each groups as group}
          <Col xl={5} md={6} cols={12}>
            <div in:fade={{ duration: 500 }}>
              <GroupCard {group} />
            </div>
          </Col>
        {/each}
      {/await}
    </Row>
  </Col>
</Row>
