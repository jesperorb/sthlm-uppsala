import type { TrainAnnouncement } from "./TrainAnnouncement"

export type ApiResponse = {
  RESPONSE: {
    RESULT: { TrainAnnouncement: TrainAnnouncement[] }[]
  }
}