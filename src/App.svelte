<script lang="ts">
  import { fetchTrafikInfo } from "./api";
  import { dateToHHMM, isMovingo, sortByDate } from "./util";
  import { departureLocation, onlyMovingo } from "./store";
  import type { TrainAnnouncement } from "./TrainAnnouncement";
  import { locationToName } from "./Location";
  let trainAnnouncements: TrainAnnouncement[] = [];
  let loading = false;
  $: arrivalLocation = $departureLocation === "Cst" ? "U" : "Cst";

  $: filteredTrainAnnouncements = $onlyMovingo
    ? sortByDate(trainAnnouncements.filter(isMovingo))
    : sortByDate(trainAnnouncements);

  const toggleLocation = () => {
    $departureLocation = $departureLocation === "Cst" ? "U" : "Cst";
  };

  const toggleMovingo = () => {
    $onlyMovingo = !$onlyMovingo;
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
      console.log(error);
      loading = false;
    }
  };

  const onClick = () => {
    fetcher({ departureLocation: $departureLocation, arrivalLocation });
  };

  $: fetcher({ departureLocation: $departureLocation, arrivalLocation });
</script>

<main>
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
            <span>{ta.Deviation.map((d) => d.Description).join(", ")}</span>
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
  <h1 on:click={toggleLocation}>
    {locationToName[$departureLocation]} → {locationToName[arrivalLocation]}
  </h1>
  <button on:click={toggleMovingo} title="Toggle only Movingo">M</button>
  <button on:click={onClick} disabled={loading} title="Reload">R</button>
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
    color: rgba(0, 0, 0, 0.7);
  }

  body,
  html,
  ul,
  ol {
    margin: 0;
    padding: 0;
  }

  body,
  html,
  #app {
    height: 100%;
  }

  h1 {
    font-size: 1.5rem;
    cursor: pointer;
  }

  main {
    padding: 1rem 0.5rem;
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0.5rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
    box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.1);
  }

  ul {
    list-style: none;
    border: 1px solid lightgrey;
    border-radius: 8px;
  }

  button {
    padding: 1rem 2rem;
    cursor: pointer;
    background-color: #00af49;
    color: white;
    font-weight: bold;
    border: 1px solid #00af49;
    border-radius: 2px;
  }

  li:last-child div {
    border-bottom: 0;
  }

  .delayed {
    font-weight: normal;
    text-decoration: line-through;
    padding: 2px;
    background-color: rgba(255, 255, 56, 1);
    border: 1px solid rgb(219, 219, 46);
    border-radius: 4px;
  }

  .departured {
    text-decoration: line-through;
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
    text-decoration: line-through;
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
</style>
