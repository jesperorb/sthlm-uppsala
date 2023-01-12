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
  import { locationToName } from "./api/Location";
  import RefreshIcon from "./ui/RefreshIcon.svelte";
  import LoadingIcon from "./ui/LoadingIcon.svelte";
  import TrainCard from "./ui/TrainCard.svelte";

  let trainAnnouncements: TrainAnnouncement[] = [];
  let loading = false;
  let fromTime = getDefaultFromTimeForDatePicker();
  $: arrivalLocation = $departureLocation === "Cst" ? "U" : "Cst";

  $: filteredTrainAnnouncements = $onlyMovingo
    ? sortByDate(trainAnnouncements.filter(isMovingo))
    : sortByDate(trainAnnouncements);

  const toggleLocation = () => {
    $departureLocation = $departureLocation === "Cst" ? "U" : "Cst";
  };

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

  const onClick = () => {
    fetcher({
      departureLocation: $departureLocation,
      arrivalLocation,
      fromTime,
    });
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
  <h1>
    {locationToName[$departureLocation]} → {locationToName[arrivalLocation]}
  </h1>
  <p class="date">
    {new Intl.DateTimeFormat().format(new Date(fromTime))}
  </p>
  <ul>
    {#each filteredTrainAnnouncements as trainAnnouncement}
      <TrainCard {trainAnnouncement} />
    {/each}
  </ul>
</main>
<footer>
  <div class="options">
    <label>
      <input type="checkbox" bind:checked={$onlyMovingo} id="toggleMovingo" />
      Movingo
    </label>
    <label>
      From
      <input type="datetime-local" step="1" bind:value={fromTime} />
    </label>
  </div>
  <div class="buttons">
    <button on:click={toggleLocation} disabled={loading}>
      Change direction
    </button>
    <button on:click={onClick} disabled={loading} class="refresh">
      <RefreshIcon />
    </button>
  </div>
</footer>

<style global>
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body,
  html {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    line-height: 1.5;
    color: #333;
  }

  body,
  html,
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  body,
  html,
  #app {
    height: 100%;
    margin-bottom: 150px;
  }

  main {
    padding: 0.5rem 0;
  }

  h1 {
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
  }

  footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 150px;
    padding: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 2.25rem;
    background-color: #fff;
    box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
  }

  footer > * {
    margin-bottom: 0.5rem;
  }

  button {
    padding: 1rem 1.5rem;
    background-color: rgb(0, 171, 59);
    border: none;
    color: white;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }

  button:hover {
    background-color: rgb(0, 157, 54);
  }

  .refresh {
    padding: 0.8rem 1rem;
  }
  .date {
    text-align: center;
    margin-top: 0;
  }

  /* some phones are smaller than others */
  @media only screen and (max-width: 320px), only screen and (max-height: 320px) {
    main {
      padding: 0.25rem;
    }
    h1 {
      font-size: 1.25rem;
    }
    .date {
      font-size: 0.75rem;
      margin: 0;
    }
    footer {
      padding: 0.25rem;
      height: 60px;
    }
    .buttons {
      gap: 0.5rem;
    }
  }
</style>
