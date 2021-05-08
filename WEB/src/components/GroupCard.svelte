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
    Row
  } from 'svelte-materialify';
  import { getGroupPays, getGroupStyle } from '../neo4j';
  import type { GroupProperties } from '../types/Group';

  export let group: GroupProperties;
</script>

<Card>
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{group.name}</CardTitle>
      {#await getGroupStyle(group) then style}
        <CardSubtitle class="pl-7">{style.name}</CardSubtitle>
      {/await}
      <div class="pl-7 d-none d-md-block">
        {#await getGroupPays(group) then pays}
          <Chip label outlined>
            <Icon path={mdi.mdiMapMarker} />
            <span>{pays.name}</span>
          </Chip>
        {/await}
      </div>
      <CardActions>
        <Button class="pl-7" text on:click={() => goto(`/Albums/${group.id}`)}>More Info</Button>
      </CardActions>
    </Col>
  </Row>
</Card>
