import type { TrainAnnouncement } from "./TrainAnnouncement"

export const dateToHHMM = (date: string) => {
  return new Date(date).toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const sortByDate = (trainAnnouncements: TrainAnnouncement[]) => {
  return trainAnnouncements.sort(
    (a, b) =>
      +new Date(a.AdvertisedTimeAtLocation) -
      +new Date(b.AdvertisedTimeAtLocation)
  )
}

export const isMovingo = (trainAnnouncement: TrainAnnouncement) => {
  return trainAnnouncement.OtherInformation?.some((p) =>
    p.Description === "Movingo gäller."
  )
}