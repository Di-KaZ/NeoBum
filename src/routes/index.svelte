<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'svelte-materialify';
  import { fade, fly } from 'svelte/transition';

  let ready = false;
  export let open: () => void;

  onMount(() => (ready = true));
</script>

<div class="d-flex justify-center align-center flex-column" style="height: calc(100vh - 104px)">
  {#if ready}
    <div class="text-h1 d-flex">
      <span class="red-text" in:fly={{ y: -200, duration: 700 }}>Neo</span>
      <span class="purple-text" in:fly={{ y: 200, duration: 700 }}>Bum</span>
    </div>
    <hr style="width: 10%;height:3px;border-radius:5px;border:0px;" class="black ma-2 " />
    <h3 class="text-overline indigo-text" in:fade={{ delay: 150, duration: 500 }}>
      Neo4j Music Library
    </h3>
    <Button text on:click={open}>View</Button>
  {/if}
</div>
