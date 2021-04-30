<script context="module">
</script>

<script lang="ts">
  import { MaterialApp, Overlay } from 'svelte-materialify';
  import Footer from '../components/Footer.svelte';
  import Navbar from '../components/Navbar.svelte';
  import NavDrawer from '../components/NavDrawer.svelte';

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
  <slot {open} />
  <Overlay index={1} {active} on:click={close} absolute />
  <NavDrawer {active} {close} />
  <Footer />
</MaterialApp>

<style global>
  body {
    min-height: 100vh;
  }
</style>
