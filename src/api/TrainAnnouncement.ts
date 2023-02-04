export type TrainAnnouncement = {
  LocationSignature: string;
  FromLocation: Location[];
  ViaFromLocation: Location[];
  ToLocation: Location[];
  ViaToLocation: Location[];
  TimeAtLocation?: string;
  AdvertisedTimeAtLocation: string;
  EstimatedTimeAtLocation?: string;
  AdvertisedTrainIdent: string;
  ProductInformation?: MetaInformation[];
  Canceled: boolean;
  ModifiedTime: string;
  Advertised: boolean;
  EstimatedTimeIsPreliminary?: boolean;
  TrackAtLocation: string;
  Deviation?: MetaInformation[];
  OtherInformation?: MetaInformation[];
}

export type Location = { LocationName: string; Priority: number, Order: number; }
export type MetaInformation = { Code: string; Description: string; };

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
  ProductInformation: [],
  Canceled: false,
  ModifiedTime: "2022-05-14T07:37:00.000+02:00",
  Advertised: true,
  EstimatedTimeIsPreliminary: false,
  TrackAtLocation: "",
  Deviation: [],
  OtherInformation: []
}
