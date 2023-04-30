<script lang="ts">
  import { onlyMovingo, departureLocation, layout } from "../store";
  import { slide } from 'svelte/transition'
  import ChangeDirectionIcon from "./ChangeDirectionIcon.svelte";
  import RefreshIcon from "./RefreshIcon.svelte";
  import SettingsIcon from "./SettingsIcon.svelte";
  export let loading: boolean;
  export let refresh: () => void;
  export let fromTime: string;

  let showOptions = false;

  const toggleShowOptions = () => {
    showOptions = !showOptions;
  };

  const toggleLocation = () => {
    $departureLocation = $departureLocation === "Cst" ? "U" : "Cst";
  };
</script>

<footer>
  <div class="buttons buttons--{$layout}">
    <button
      class="settings-icon"
      on:click={toggleShowOptions}
      aria-label="Settings"
    >
      <SettingsIcon />
    </button>
    <button
      on:click={toggleLocation}
      disabled={loading}
      aria-label="Change direction"
    >
        <ChangeDirectionIcon />
    </button>
    <button on:click={refresh} disabled={loading} aria-label="Refresh">
      <RefreshIcon />
    </button>
  </div>
  {#if showOptions}
  <div class="settings" transition:slide={{duration: 200}}>
    <label>
      Show only Movingo
      <input type="checkbox" bind:checked={$onlyMovingo} id="toggleMovingo" />
    </label>
    <label>
      <span>From time</span>
      <input type="datetime-local" step="1" bind:value={fromTime} />
    </label>
    <fieldset>
      <legend>Layout:</legend>
      <input
        type="radio"
        id="normal"
        bind:group={$layout}
        name="layout"
        value="normal"
      />
      <label for="normal">Normal</label>
      <input
        type="radio"
        id="dense"
        bind:group={$layout}
        name="layout"
        value="dense"
      />
      <label for="dense">Dense</label>
    </fieldset>
  </div>
  {/if}
</footer>

<style>
  footer {
    position: sticky;
    bottom: 0;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    box-shadow: 0px -2px 2px rgba(0, 0, 0, 0.1);
  }

  button {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    border: none;
    padding: 1rem 1.5rem;
    color: #fff;
    font-weight: 700;
    border-radius: 8px;
    cursor: pointer;
    background-color: rgb(0, 171, 59);
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
      color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  button:hover {
    background-color: rgb(0, 157, 54);
  }

  .buttons {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .buttons--dense button {
    padding: 0.25rem 0.5rem;
  }

  .settings {
    flex-direction: column;
    display: flex;
    padding: 0.5rem;
    gap: 0.5rem;
  }
  .settings-icon {
    margin-right: auto;
  }

  fieldset {
    border-radius: 8px;
  }
</style>
