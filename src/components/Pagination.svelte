<script>
  import { ButtonGroup, ButtonGroupItem } from 'svelte-materialify';

  export let activePage = 1;
</script>

<ButtonGroup rounded class="pa-10">
  <ButtonGroupItem class="red" on:click={() => activePage - 1 && activePage--}>Prev</ButtonGroupItem
  >
  <ButtonGroupItem>Page : {activePage}</ButtonGroupItem>
  <ButtonGroupItem class="red" on:click={() => activePage++}>Next</ButtonGroupItem>
</ButtonGroup>
