<script lang="ts">
  import { onMount } from 'svelte';
  import { MaterialApp, Overlay } from 'svelte-materialify';
  import { initThief } from '../colorthief';
  import Footer from '../components/Footer.svelte';
  import Navbar from '../components/Navbar.svelte';
  import NavDrawer from '../components/NavDrawer.svelte';
  import { initDb } from '../neo4j';

  onMount(() => {
    initDb();
    initThief();
  });
  let active = false;

  function close() {
    active = false;
  }

  function open() {
    active = true;
  }
</script>

<MaterialApp>
  <Navbar {open} />
  <slot />
  <Overlay index={1} {active} on:click={close} fixed />
  <NavDrawer {active} {close} />
  <Footer />
</MaterialApp>

<style global>
  body,
  .s-app {
    min-height: 100vh;
  }
</style>
