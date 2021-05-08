<script lang="ts">
  import * as mdi from '@mdi/js';
  import { AppBar, Button, Icon, TextField } from 'svelte-materialify';
  import { searchStore } from '../searchStore';

  export let open: () => void;
</script>

<AppBar class="d-flex pa-1 red" style="position:sticky;width:100%;top:0">
  <div class="pointer" slot="icon" on:click={open}>
    <Icon path={mdi.mdiMusicBoxMultiple} />
  </div>
  <span class="pointer" slot="title" on:click={open}>Neo Bum</span>
  <div style="flex-grow:4" />
  <TextField flat solo placeholder="Search" class="mt-2" bind:value={$searchStore} />
  <Button class="white" fab>
    <Icon path={mdi.mdiMagnify} />
  </Button>
</AppBar>

<style>
  .pointer {
    cursor: pointer;
  }
</style>
