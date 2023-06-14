import { groupBy } from "../utils";
import type { ApiResponse } from "./ApiResponse";
import type { TrainAnnouncement } from "./TrainAnnouncement";
import { trainAnnouncementIncludeKeys } from "./trainAnnouncementModel";

type FetchTrafikInfoConfig = {
  departureLocation: string,
  arrivalLocation: string
  fromTime: string;
  toTime: string;
}

const timeFilter = (fromTime: string, toTime: string): string => {
  return `
    <AND>
      <GT name='AdvertisedTimeAtLocation' value='${fromTime}'/>
      <LT name='AdvertisedTimeAtLocation' value='${toTime}'/>
    </AND>
  `;
}

// This is a bit of a hack, but it's because the data can be inconsistent,
// sometimes the ViaFromLocation or ViaToLocation is not included.
const stationFilter = (fromStation: string, toStation: string): string => {
  // Try to find all relevant announcements for a given departure from "LocationSignature".
  const fromStationFilter = `
    <AND>
      <EQ name='LocationSignature' value='${fromStation}' />
      <EQ name='ActivityType' value='Avgang' />
      <OR>
        <EQ name='FromLocation.LocationName' value='${fromStation}' />
        <EQ name='ViaToLocation.LocationName' value='${toStation}' />
        <EQ name='ToLocation.LocationName' value='${toStation}' />
      </OR>
    </AND>
  `;
  // Try to find all relevant announcements for a given arrival at "LocationSignature".
  const toStationFilter = `
    <AND>
      <EQ name='LocationSignature' value='${toStation}' />
      <EQ name='ActivityType' value='Ankomst' />
      <OR>
        <EQ name='FromLocation.LocationName' value='${fromStation}' />
        <EQ name='ViaFromLocation.LocationName' value='${fromStation}' />
        <EQ name='ToLocation.LocationName' value='${toStation}' />
      </OR>
    </AND>
  `;

  return `
    <OR>
      ${fromStationFilter}
      ${toStationFilter}
    </OR>
  `;
}

const fetchAnnouncements = async (andFilters: string[]): Promise<TrainAnnouncement[]> => {
  const result = await fetch(
    "https://api.trafikinfo.trafikverket.se/v2/data.json",
    {
      method: "POST",
      body: `
        <REQUEST>
          <LOGIN authenticationkey='${import.meta.env.VITE_AUTH_KEY}' />
          <QUERY objecttype='TrainAnnouncement' schemaversion='1.8'>
            <FILTER>
              <AND>
                ${andFilters.join('')}
              </AND>
            </FILTER>
            ${trainAnnouncementIncludeKeys}
          </QUERY>
        </REQUEST>
      `,
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/json",
      },
    }
  );

  const response = await result.json() as ApiResponse;
  return response.RESPONSE.RESULT[0].TrainAnnouncement;
}

export const fetchTrafikInfo = async ({
  departureLocation,
  arrivalLocation,
  fromTime,
  toTime,
}: FetchTrafikInfoConfig) => {
  const allAnnouncements = await fetchAnnouncements([
    `<EQ name='Advertised' value='true' />`,
    timeFilter(fromTime, toTime),
    stationFilter(departureLocation, arrivalLocation),
  ]);

  const announcements =  Object.entries(groupBy(allAnnouncements, "AdvertisedTrainIdent")).map(([, value]) => {
    if(value.length === 1) {
      return undefined;
    }
    const departureEntry = value
      .find(v => v.LocationSignature === departureLocation && v.ActivityType === "Avgang");
    const arrivalEntry = value
      .find(v => v.LocationSignature === arrivalLocation && v.ActivityType === "Ankomst");

    return {
      ...departureEntry,
      ArrivalTime: arrivalEntry.AdvertisedTimeAtLocation,
    } as TrainAnnouncement
  })

  return announcements.filter(Boolean);
}
