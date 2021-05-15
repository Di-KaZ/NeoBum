<script lang="ts">
  import { goto } from '$app/navigation';
  import * as mdi from '@mdi/js';
  import { Button, Icon, List, ListItem, NavigationDrawer, Row } from 'svelte-materialify';
  import { showQueryStore, toggleShowQuery } from '../showQueryStore';

  export let active: boolean;
  export let close: () => void;
</script>

<NavigationDrawer {active} index={2} class="pt-15" fixed>
  <List class="d-flex">
    <ListItem
      on:click={() => {
        goto('/');
        close();
      }}
    >
      <span slot="prepend">
        <Icon class="red-text" path={mdi.mdiHome} />
      </span>
      Home</ListItem
    >
    <ListItem
      on:click={() => {
        goto('/Albums');
        close();
      }}
    >
      <span slot="prepend">
        <Icon class="red-text" path={mdi.mdiAlbum} />
      </span>
      Albums</ListItem
    >
    <ListItem
      on:click={() => {
        goto('/Artists');
        close();
      }}
      ><span slot="prepend">
        <Icon class="red-text" path={mdi.mdiAccountMusic} />
      </span>Artists</ListItem
    >
    <ListItem
      on:click={() => {
        goto('/Groups');
        close();
      }}
      ><span slot="prepend">
        <Icon class="red-text" path={mdi.mdiAccountGroup} />
      </span>Groups</ListItem
    >
  </List>
  <Row class="align-center justify-center">
    {#if $showQueryStore}
      <Button on:click={toggleShowQuery} class="green white-text">
        <span class="pr-4">Show Query</span>
        <Icon path={mdi.mdiCheckUnderline} />
      </Button>
    {:else}
      <Button on:click={toggleShowQuery} class="red white-text">
        <span class="pr-4">Hide Query</span>
        <Icon path={mdi.mdiCancel} />
      </Button>
    {/if}
  </Row>
</NavigationDrawer>
