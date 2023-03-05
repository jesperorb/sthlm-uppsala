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
  TechnicalTrainIdent: string;
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
