import type { TrainAnnouncement } from "./TrainAnnouncement";

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
  TechnicalTrainIdent: "",
  ProductInformation: [],
  Canceled: false,
  ModifiedTime: "2022-05-14T07:37:00.000+02:00",
  Advertised: true,
  EstimatedTimeIsPreliminary: false,
  TrackAtLocation: "",
  Deviation: [],
  OtherInformation: []
}

export const trainAnnouncementIncludeKeys =
  Object.keys(trainAnnouncementModel)
    .map(key => `<INCLUDE>${key}</INCLUDE>`)
    .join("\n")

