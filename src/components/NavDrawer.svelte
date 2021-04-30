<script lang="ts">
  import { goto } from '$app/navigation';
  import { mdiAccountGroup, mdiAccountMusic, mdiAlbum, mdiHome } from '@mdi/js';
  import { Icon, List, ListItem, NavigationDrawer } from 'svelte-materialify';

  export let active: boolean;
  export let close: () => void;
</script>

<NavigationDrawer {active} index={2} absolute class="pt-15">
  <List class="d-flex">
    <ListItem
      on:click={() => {
        goto('/');
        close();
      }}
    >
      <span slot="prepend">
        <Icon class="red-text" path={mdiHome} />
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
        <Icon class="red-text" path={mdiAlbum} />
      </span>
      Albums</ListItem
    >
    <ListItem
      on:click={() => {
        goto('/Artists');
        close();
      }}
      ><span slot="prepend">
        <Icon class="red-text" path={mdiAccountMusic} />
      </span>Artists</ListItem
    >
    <ListItem
      on:click={() => {
        goto('/Groups');
        close();
      }}
      ><span slot="prepend">
        <Icon class="red-text" path={mdiAccountGroup} />
      </span>Groups</ListItem
    >
  </List>
</NavigationDrawer>
