<script lang="ts">
  import { formatMetaInfo } from "../utils";
  import type { TrainAnnouncement } from "../api/TrainAnnouncement";
  import Dialog from "./Dialog.svelte";
  import { metaInfo } from "../api/trainAnnouncementModel";

  export let showModal: boolean;
  export let trainAnnouncement: TrainAnnouncement | undefined | null;
</script>

<Dialog {showModal}>
	<h2 slot="header">
	</h2>
  {#if trainAnnouncement}
    <div>
      {#each metaInfo as info }
      <p>
        {formatMetaInfo(trainAnnouncement, info)}
      </p>
      {/each}
    </div>
  {/if}
</Dialog>