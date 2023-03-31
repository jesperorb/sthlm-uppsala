<script lang="ts">
  import { fetchTrafikInfo } from "./api";
  import {
    getDefaultFromTimeForDatePicker,
    getDefaultToTime,
    isMovingo,
    sortByDate,
  } from "./utils";
  import { departureLocation, onlyMovingo } from "./store";
  import type { TrainAnnouncement } from "./api/TrainAnnouncement";
  import LoadingIcon from "./ui/LoadingIcon.svelte";
  import TrainCard from "./ui/TrainCard.svelte";
  import Options from "./ui/Options.svelte";
  import Header from "./ui/Header.svelte";
  import Dialog from "./ui/Dialog.svelte";

  let trainAnnouncements: TrainAnnouncement[] = [];
  let loading = false;
  let fromTime = getDefaultFromTimeForDatePicker();
  let showModal = false;
  let selectedTrainAnnouncement: TrainAnnouncement | null = null;
  $: arrivalLocation = $departureLocation === "Cst" ? "U" : "Cst";

  $: filteredTrainAnnouncements = $onlyMovingo
    ? sortByDate(trainAnnouncements.filter(isMovingo))
    : sortByDate(trainAnnouncements);

  const fetcher = async ({
    departureLocation,
    arrivalLocation,
    fromTime,
  }: {
    departureLocation: string;
    arrivalLocation: string;
    fromTime: string;
  }) => {
    loading = true;
    try {
      const response = await fetchTrafikInfo({
        departureLocation: departureLocation,
        arrivalLocation,
        fromTime: new Date(fromTime).toUTCString(),
        toTime: getDefaultToTime(fromTime).toUTCString(),
      });
      loading = false;
      trainAnnouncements = response;
    } catch (error) {
      loading = false;
    }
  };

  const refresh = () => {
    fetcher({
      departureLocation: $departureLocation,
      arrivalLocation,
      fromTime,
    });
  };

  const openDetails = (ta: TrainAnnouncement) => {
    if (showModal) {
      selectedTrainAnnouncement = null;
    } else {
      selectedTrainAnnouncement = ta;
    }
    showModal = !showModal;
  };

  $: fetcher({
    departureLocation: $departureLocation,
    arrivalLocation,
    fromTime,
  });

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      fromTime = getDefaultFromTimeForDatePicker();
    }
  });
</script>

<main>
  {#if loading}
    <LoadingIcon />
  {/if}
  <Header
    {arrivalLocation}
    departureLocation={$departureLocation}
    {fromTime}
  />
  <ul>
    {#each filteredTrainAnnouncements as trainAnnouncement}
      <TrainCard {trainAnnouncement} {openDetails} />
    {/each}
  </ul>
</main>
<Options {loading} {refresh} bind:fromTime={fromTime} />
<Dialog bind:showModal>
	<h2 slot="header">
	</h2>
  {#if selectedTrainAnnouncement}
    <div>
      <p>
        {selectedTrainAnnouncement.OtherInformation?.map((p) => p.Description).join("") ?? ""}
      </p>
      <p>
        {selectedTrainAnnouncement.Deviation?.map((p) => p.Description).join("") ?? ""}
      </p>
      <p>
        {selectedTrainAnnouncement.Booking?.map((p) => p.Description).join("") ?? ""}
      </p>
      <p>
        {selectedTrainAnnouncement.Service?.map((p) => p.Description).join("") ?? ""}
      </p>
      <p>
        {selectedTrainAnnouncement.TrainComposition?.map((p) => p.Description).join("") ?? ""}
      </p>
    </div>
  {/if}
</Dialog>

<style global>
  :root {
    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    --font-color: hsl(20,20,20);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  * {
    margin: 0;
  }
  html,
  body,
  #app {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--font-color);
  }
  body {
    line-height: 1.5;
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
  }
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }
  input,
  button,
  textarea,
  select {
    font: inherit;
  }
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  body,
  html,
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  main {
    flex: 1 0 auto;
  }
</style>
