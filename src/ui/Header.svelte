<script lang="ts">
  import { layout } from "../store";
  import { locationToName } from "../api/Location";

  export let departureLocation: string;
  export let arrivalLocation: string;
  export let fromTime: string;
</script>

<header class="header--{$layout}">
  <h1>
    {locationToName[departureLocation]} → {locationToName[arrivalLocation]}
  </h1>
  <p>
    {new Intl.DateTimeFormat().format(new Date(fromTime))}
  </p>
</header>

<style>
  h1 {
    font-size: 1.75rem;
  }
  .header--dense h1 {
    font-size: 1.25rem;
  }
  h1, p {
    text-align: center;
  }
  header {
    margin-bottom: 1rem;
  }
  .header--dense {
    margin-bottom: 0;
  }
</style>