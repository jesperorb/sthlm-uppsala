<script lang="ts">
  import { layout } from "../store";
  import type { TrainAnnouncement } from "../api/TrainAnnouncement";
  import { dateToHHMM } from "../utils";
  import InfoIcon from "./InfoIcon.svelte";
  export let trainAnnouncement: TrainAnnouncement;
  export let openDetails: (ta: TrainAnnouncement) => void;
</script>

<li>
  <div class="card card--{$layout}" class:card--canceled={trainAnnouncement.Canceled}>
    <div class="card__header">
      <div class="card__time">
        <strong
          class:delayed={Boolean(trainAnnouncement.EstimatedTimeAtLocation)}
          class:departured={Boolean(trainAnnouncement.TimeAtLocation)}
        >
          {dateToHHMM(trainAnnouncement.AdvertisedTimeAtLocation)}
        </strong>
        {#if trainAnnouncement.EstimatedTimeAtLocation}
          <strong class:departured={Boolean(trainAnnouncement.TimeAtLocation)}>
            {dateToHHMM(trainAnnouncement.EstimatedTimeAtLocation)}
            {#if trainAnnouncement.EstimatedTimeIsPreliminary}
              <span class="card__preliminary"> Preliminary </span>
            {/if}
          </strong>
        {/if}
      </div>
      <div class="card__track">
        {trainAnnouncement.TrackAtLocation} #
      </div>
    </div>
    {#if trainAnnouncement.TimeAtLocation}
      <strong>Departured: {dateToHHMM(trainAnnouncement.TimeAtLocation)}</strong>
    {/if}
    <div class="card__transport">
      {trainAnnouncement.ProductInformation?.map((p) => p.Description).join(" ") ?? ""}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://trafikinfo.sj.se/sv/tag/${
          trainAnnouncement.AdvertisedTrainIdent
        }?date=${new Date(
          trainAnnouncement.AdvertisedTimeAtLocation
        ).toLocaleDateString()}`}>{trainAnnouncement.AdvertisedTrainIdent}</a
      >
      <button
        on:click={() => openDetails(trainAnnouncement)}
        aria-label="Show details"
      >
        <InfoIcon />
      </button>
    </div>
    {#if trainAnnouncement.Deviation?.length}
      <span class="card__deviation"
        >{trainAnnouncement.Deviation.filter((d) => d.Description !== "Ej servering").map((d) => d.Description).join(", ")}</span
      >
    {/if}
  </div>
</li>

<style>
   .delayed,
  .departured,
  .card--canceled .card__time,
  .card--canceled .card__transport {
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
    border-bottom: 1px solid rgb(240, 230, 240);
  }

  .card--dense {
    padding: 0.25rem;
  }

  a {
    color: #333;
    text-decoration: none;
    border-bottom: 1px solid #333;
  }

  button {
    cursor: pointer;
    appearance: none;
    border: none;
    margin-left: auto;
    background-color: transparent;
    color: #888;
    padding: 0;
  }

  li:nth-child(odd) {
    background-color: rgb(250, 250, 250);
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
    display: flex;
    align-items: center;
    gap: 0.25rem
  }

  .card__preliminary {
    font-weight: normal;
    padding: 2px;
    color: darkgoldenrod;
    border-radius: 4px;
  }

</style>
