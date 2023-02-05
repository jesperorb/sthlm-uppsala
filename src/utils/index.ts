import type { TrainAnnouncement } from "../api/TrainAnnouncement"

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

export const getDefaultFromTime = (): Date => {
  const nowInMinutes = new Date().getMinutes();
  const from = new Date();
  from.setMinutes(nowInMinutes - 30);
  return from;
};

export const getDefaultFromTimeForDatePicker = () => {
  const fromTime = getDefaultFromTime();
  return `${fromTime.toLocaleDateString()}T${fromTime.toLocaleTimeString()}`;
};

export const getDefaultToTime = (fromTime: string): Date => {
  return new Date(new Date(fromTime).setHours(23, 59, 59, 999))
};

const isAdvertised = (
  trainAnnouncement: TrainAnnouncement
) => trainAnnouncement.Advertised

const isMuseumTrain = (
  trainAnnouncement: TrainAnnouncement
) => trainAnnouncement.ProductInformation
  ?.some(pi => pi.Description === "Museitåg")

const hasChoosenArrivalLocation = (
  arrivalLocation: string
) => (
  trainAnnouncement: TrainAnnouncement
) => trainAnnouncement.ToLocation?.some(tl => tl.LocationName === arrivalLocation)
  || trainAnnouncement.ViaToLocation?.some(vtl => vtl.LocationName === arrivalLocation)

const isManuallyAddedDepartureWithMissingInfo = (
  trainAnnouncement: TrainAnnouncement
) => ["919", "929", "17"].includes(trainAnnouncement.AdvertisedTrainIdent)

export const isApplicableDeparture = (arrivalLocation: string) => (
  trainAnnouncement: TrainAnnouncement
) => {
  return (
    isAdvertised(trainAnnouncement) &&
    !isMuseumTrain(trainAnnouncement) &&
    hasChoosenArrivalLocation(arrivalLocation)(trainAnnouncement)
  ) || isManuallyAddedDepartureWithMissingInfo(trainAnnouncement)
}