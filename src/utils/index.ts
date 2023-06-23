import type { MetaInfoKeys, MetaInformation, TrainAnnouncement } from "../api/TrainAnnouncement"

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
  return !trainAnnouncement.ProductInformation.some(p => p.Description.includes("InterCity"))
}

export const hasExtraInfo = (trainAnnouncement: TrainAnnouncement) => Boolean(
  trainAnnouncement.OtherInformation?.length ||
  trainAnnouncement.Deviation?.length ||
  trainAnnouncement.Booking?.length ||
  trainAnnouncement.Service?.length ||
  trainAnnouncement.TrainComposition?.length
)

export const getDescription = (meta: MetaInformation) => meta.Description;

export const formatMetaInfo = (
  trainAnnouncement: TrainAnnouncement,
  key: MetaInfoKeys
): string =>  trainAnnouncement[key]?.map(getDescription).join("\n") ?? "";


export const filterDeviations = (meta: MetaInformation[]) => {
  const unecessaryDeviations = [
    "Ej servering",
    "Prel. tid"
  ]
  return meta.filter((p) => !unecessaryDeviations.includes(p.Description))
}

export const getDefaultFromTime = (showDeparturedFromNow: number = 15): Date => {
  const nowInMinutes = new Date().getMinutes();
  const from = new Date();
  from.setMinutes(nowInMinutes - showDeparturedFromNow);
  return from;
};

export const getDefaultFromTimeForDatePicker = (showDeparturedFromNow: number) => {
  const fromTime = getDefaultFromTime(showDeparturedFromNow);
  return `${fromTime.toLocaleDateString()}T${fromTime.toLocaleTimeString()}`;
};

export const getDefaultToTime = (fromTime: string): Date => {
  const endOfDay = new Date(new Date(fromTime).setHours(23, 59, 59, 999));
  endOfDay.setHours(endOfDay.getHours() + 3);
  return endOfDay;
};

type ObjectKey = string | number | symbol

export const groupBy = <
  K extends ObjectKey,
  TItem extends Record<K, ObjectKey>
>(
  items: TItem[],
  key: K
): Record<ObjectKey, TItem[]> =>
  items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {} as Record<ObjectKey, TItem[]>
  )