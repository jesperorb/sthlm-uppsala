import { isApplicableDeparture } from "../utils";
import { TrainAnnouncement, trainAnnouncementModel } from "./TrainAnnouncement";

type FetchTrafikInfoConfig = {
  departureLocation: string,
  arrivalLocation: string
  fromTime: string;
  toTime: string;
}

export const fetchTrafikInfo = async ({
  departureLocation,
  arrivalLocation,
  fromTime,
  toTime,
}: FetchTrafikInfoConfig) => {
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
                <EQ name='LocationSignature' value='${departureLocation}' />
                <EQ name='ActivityType' value='Avgang' />
                <GT name='AdvertisedTimeAtLocation' value='${fromTime}'/>
                <LT name='AdvertisedTimeAtLocation' value='${toTime}'/>
              </AND>
            </FILTER>
            ${
              Object.keys(trainAnnouncementModel)
                .map(key=> `<INCLUDE>${key}</INCLUDE>`)
                .join("\n")
             }
          </QUERY>
        </REQUEST>`,
      headers: {
        "Content-Type": "application/xml",
        Accept: "application/json",
      },
    }
  )
  const { RESPONSE } = await result.json();
  const announcements = RESPONSE.RESULT[0].TrainAnnouncement as TrainAnnouncement[];
  return announcements.filter(isApplicableDeparture(arrivalLocation))
}