<script lang="ts">
  import * as mdi from '@mdi/js';
  import { Button, Icon, List, ListItem, Menu, Row } from 'svelte-materialify';
  import { handleChangeFilter, handleChhangeSort, searchStore } from '../searchStore';

  export let options: string[];
</script>

<Row class="pa-5 justify-center">
  <Menu hover closeOnClick closeOnClickOutside>
    <div slot="activator">
      <Button>Filter by : {$searchStore.filterBy}</Button>
    </div>
    <List>
      {#each options as option}
        <ListItem on:click={() => handleChangeFilter(option)}>{option}</ListItem>
      {/each}
    </List>
  </Menu>
  <Button on:click={handleChhangeSort}>
    <Icon
      path={$searchStore.order
        ? mdi.mdiSortAlphabeticalDescending
        : mdi.mdiSortAlphabeticalAscending}
    />
    <span>{$searchStore.order ? 'DESC' : 'ASC'}</span>
  </Button>
</Row>
