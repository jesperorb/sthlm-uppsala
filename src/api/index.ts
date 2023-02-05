import { TrainAnnouncement, trainAnnouncementModel } from "./TrainAnnouncement";

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

const trainIdFilter = (trainIds: Set<string>): string => {
  return `
    <OR>
      ${Array.from(trainIds).map(id => `<EQ name='AdvertisedTrainIdent' value='${id}' />`).join("\n")}
    </OR>
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
        <EQ name='ToLocation.LocationName' value='${toStation}' />
        <EQ name='ViaToLocation.LocationName' value='${toStation}' />
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
          <QUERY objecttype='TrainAnnouncement' schemaversion='1.6'>
            <FILTER>
              <AND>
                ${andFilters.join('')}
              </AND>
            </FILTER>
            ${Object.keys(trainAnnouncementModel)
          .map(key => `<INCLUDE>${key}</INCLUDE>`)
          .join("\n")
        }

          </QUERY>
        </REQUEST>
      `,
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/json",
      },
    }
  );

  const { RESPONSE } = await result.json();
  const trainAnnouncements = RESPONSE.RESULT[0].TrainAnnouncement;
  return trainAnnouncements;
}

export const fetchTrafikInfo = async ({
  departureLocation,
  arrivalLocation,
  fromTime,
  toTime,
}: FetchTrafikInfoConfig) => {

  // Some train announcements don't include all the "via from" and "via to" stations
  // so we need to fetch all announcements for the time period and look for the
  // ones that include both stations in some valid arrangement. And then we can
  // use the train IDs to get the departures we are actually interested in.

  const allAnnouncements = await fetchAnnouncements([
    timeFilter(fromTime, toTime),
    stationFilter(departureLocation, arrivalLocation),
  ]);

  const advertisedTrainAnnouncements = allAnnouncements
    .filter(ta => !ta.ProductInformation?.some(pi => pi.Description === "Museitåg"));

  const trainIDs = new Set(advertisedTrainAnnouncements.map(ta => ta.AdvertisedTrainIdent));

  // Now we can fetch all the departures for the relevant train IDs from the given station.
  const filteredAnnouncements = await fetchAnnouncements([
    `<EQ name='ActivityType' value='Avgang' />`,
    `<EQ name='LocationSignature' value='${departureLocation}' />`,
    `<EQ name='Advertised' value='true' />`,
    timeFilter(fromTime, toTime),
    trainIdFilter(trainIDs),
  ]);

  return filteredAnnouncements;
}
