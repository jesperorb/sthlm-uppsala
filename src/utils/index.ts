import type { MetaInformation, TrainAnnouncement } from "../api/TrainAnnouncement"

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
    p.Description !== "Endast SJ-biljetter gäller."
  )
}

export const filterDeviations = (meta: MetaInformation[]) => {
  const unecessaryDeviations = [
    "Ej servering",
    "Prel. tid"
  ]
  return meta.filter((p) => !unecessaryDeviations.includes(p.Description))
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
  const endOfDay = new Date(new Date(fromTime).setHours(23, 59, 59, 999));
  endOfDay.setHours(endOfDay.getHours() + 3);
  return endOfDay;
};
