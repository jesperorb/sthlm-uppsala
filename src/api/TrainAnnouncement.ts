export type TrainAnnouncement = {
  LocationSignature: string;
  FromLocation: Location[];
  ViaFromLocation?: Location[];
  ToLocation: Location[];
  ViaToLocation?: Location[];
  TimeAtLocation?: string;
  AdvertisedTimeAtLocation: string;
  EstimatedTimeAtLocation?: string;
  AdvertisedTrainIdent: string;
  OperationalTrainNumber: string;
  ProductInformation?: MetaInformation[];
  Canceled: boolean;
  ModifiedTime: string;
  Advertised: boolean;
  Service: MetaInformation[];
  Booking: MetaInformation[]
  EstimatedTimeIsPreliminary?: boolean;
  TrackAtLocation: string;
  Deviation?: MetaInformation[];
  OtherInformation?: MetaInformation[];
  TrainComposition: MetaInformation[]
}

export type Location = { LocationName: string; Priority: number, Order: number; }
export type MetaInformation = { Code: string; Description: string; };
