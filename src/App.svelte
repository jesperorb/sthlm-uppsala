<script lang="ts">
  import { fetchTrafikInfo } from "./api";
  import { dateToHHMM, isMovingo, sortByDate } from "./util";
  import { departureLocation, onlyMovingo } from "./store";
  import type { TrainAnnouncement } from "./TrainAnnouncement";
  import { locationToName } from "./Location";
  import RefreshIcon from "./RefreshIcon.svelte";

  let trainAnnouncements: TrainAnnouncement[] = [];
  let loading = false;
  $: arrivalLocation = $departureLocation === "Cst" ? "U" : "Cst";

  $: filteredTrainAnnouncements = $onlyMovingo
    ? sortByDate(trainAnnouncements.filter(isMovingo))
    : sortByDate(trainAnnouncements);

  const toggleLocation = () => {
    $departureLocation = $departureLocation === "Cst" ? "U" : "Cst";
  };

  const fetcher = async ({ departureLocation, arrivalLocation }) => {
    loading = true;
    try {
      const response = await fetchTrafikInfo({
        departureLocation: departureLocation,
        arrivalLocation,
      });
      loading = false;
      trainAnnouncements = response;
    } catch (error) {
      loading = false;
    }
  };

  const onClick = () => {
    fetcher({ departureLocation: $departureLocation, arrivalLocation });
  };

  $: fetcher({ departureLocation: $departureLocation, arrivalLocation });
</script>

<main>
  <h1>{locationToName[$departureLocation]} → {locationToName[arrivalLocation]}</h1>
  <ul>
    {#each filteredTrainAnnouncements as ta}
      <li>
        <div class="card" class:card--canceled={ta.Canceled}>
          <div class="card__header">
            <div class="card__time">
              <strong
                class:delayed={Boolean(ta.EstimatedTimeAtLocation)}
                class:departured={Boolean(ta.TimeAtLocation)}
              >
                {dateToHHMM(ta.AdvertisedTimeAtLocation)}
              </strong>
              {#if ta.EstimatedTimeAtLocation}
                <strong class:departured={Boolean(ta.TimeAtLocation)}>
                  {dateToHHMM(ta.EstimatedTimeAtLocation)}
                  {#if ta.EstimatedTimeIsPreliminary}
                    <span class="card__preliminary"> Preliminary </span>
                  {/if}
                </strong>
              {/if}
            </div>
            <div class="card__track">
              {ta.TrackAtLocation} #
            </div>
          </div>
          {#if ta.TimeAtLocation}
            <strong>Departured: {dateToHHMM(ta.TimeAtLocation)}</strong>
          {/if}
          <div class="card__transport">
            {ta.ProductInformation?.map((p) => p.Description).join("") ?? ""}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://trafikinfo.sj.se/sv/tag/${
                ta.AdvertisedTrainIdent
              }?date=${new Date(
                ta.AdvertisedTimeAtLocation
              ).toLocaleDateString()}`}>{ta.AdvertisedTrainIdent}</a
            >
          </div>
          {#if ta.Deviation?.length}
            <span class="card__deviation">{ta.Deviation.map((d) => d.Description).join(", ")}</span>
          {/if}
          {#if isMovingo(ta)}
            <span class="card__meta"> Movingo </span>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</main>
<footer>
  <label>
    <input type="checkbox" bind:checked={$onlyMovingo} id="toggleMovingo" />
    Movingo
  </label>
  <div>
    <button on:click={toggleLocation} disabled={loading}>
      Change direction
    </button>
    <button on:click={onClick} disabled={loading} class="refresh"><RefreshIcon /></button>
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
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
    margin-top: 0.75rem;
  }

  footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 150px;
    padding: 0.5rem;
    padding-bottom: 2.25rem;
    background-color: #fff;
    text-align: center;
    box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  footer > div {
    display: flex;
    gap: 1rem;
  }

  footer > * {
    margin-bottom: 0.5rem;
  }

  button {
    padding: 1rem 2rem;
    background-color: #00AB3B;
    border: none;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    box-shadow: 0 2px 5px -1px rgba(50,50,93,0.25),0 1px 3px -1px rgba(0,0,0,0.3);
    cursor: pointer;
  }

  .refresh {
    padding: 0.8rem 1rem;
  }

  .delayed, .departured, .card--canceled .card__time, .card--canceled .card__transport {
    text-decoration: line-through;
  }

  .delayed {
    font-weight: normal;
    padding: 2px;
    background-color: rgba(255, 255, 56, 1);
    border: 1px solid rgb(219, 219, 46);
    border-radius: 4px;
  }

  .card {
    padding: 1rem;
    position: relative;
    border-bottom: 1px solid lightgrey;
  }

  .card__header {
    display: flex;
    justify-content: space-between;
  }

  .card__track {
    font-weight: bold;
  }

  .card--canceled {
    background-color: rgb(185, 0, 0);
    color: white;
  }

  .card__meta {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
    font-style: italic;
    color: rgba(0, 0, 0, 0.5);
  }

  .card__transport {
    font-style: italic;
  }

  .card__preliminary {
    font-weight: normal;
    padding: 2px;
    color: darkgoldenrod;
    border-radius: 4px;
  }

  .card--canceled .card__meta {
    color: white;
  }
</style>
