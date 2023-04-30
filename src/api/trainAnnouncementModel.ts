import type { MetaInfoKeys, TrainAnnouncement } from "./TrainAnnouncement";

export const trainAnnouncementModel: Required<TrainAnnouncement> = {
  LocationSignature: "",
  FromLocation: [],
  ViaFromLocation: [],
  ToLocation: [],
  ViaToLocation: [],
  TimeAtLocation: "2022-05-14T07:37:00.000+02:00",
  AdvertisedTimeAtLocation: "2022-05-14T07:37:00.000+02:00",
  EstimatedTimeAtLocation: "2022-05-14T07:37:00.000+02:00",
  AdvertisedTrainIdent: "",
  OperationalTrainNumber: "",
  ProductInformation: [],
  Canceled: false,
  ModifiedTime: "2022-05-14T07:37:00.000+02:00",
  Advertised: true,
  EstimatedTimeIsPreliminary: false,
  TrackAtLocation: "",
  Deviation: [],
  OtherInformation: [],
  Booking: [],
  Service: [],
  TrainComposition: [],
}

export const trainAnnouncementIncludeKeys =
  Object.keys(trainAnnouncementModel)
    .map(key => `<INCLUDE>${key}</INCLUDE>`)
    .join("\n")

export const metaInfo: MetaInfoKeys[] = [
  "Deviation",
  "OtherInformation",
  "Booking",
  "Service",
  "TrainComposition"
];

