<script lang="ts">
  import { goto } from '$app/navigation';
  import { mdiMapMarker } from '@mdi/js';
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
  import type { GroupsInstance } from '../Models/Groups';
  import PaysService from '../services/PaysServices';
  import StylesService from '../services/StylesService';

  export let group: GroupsInstance;
</script>

<Card>
  <Row>
    <Col cols={8}>
      <CardTitle class="pa-7">{group.name}</CardTitle>
      {#await StylesService.getGroupStyle(group) then style}
        <CardSubtitle class="pl-7">{style.name}</CardSubtitle>
      {/await}
      <div class="pl-7 d-none d-md-block">
        {#await PaysService.getGroupPays(group) then pays}
          <Chip label class="purple-text">
            <Icon path={mdiMapMarker} />
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
