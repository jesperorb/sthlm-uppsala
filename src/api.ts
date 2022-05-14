import { TrainAnnouncement, trainAnnouncementModel } from "./TrainAnnouncement";

type FetchTrafikInfoConfig = {
  departureLocation: string,
  arrivalLocation: string
}

export const fetchTrafikInfo = async ({
  departureLocation,
  arrivalLocation
}: FetchTrafikInfoConfig) => {
  const now = new Date();
  const nowInMinutes = now.getMinutes();
  const from = new Date();
  const to = new Date();
  from.setMinutes(nowInMinutes - 30);
  to.setMinutes(nowInMinutes + 120);
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
                <GT name='AdvertisedTimeAtLocation' value='${from.toUTCString()}'/>
                <LT name='AdvertisedTimeAtLocation' value='${to.toUTCString()}'/>
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
  return announcements
    .filter(ta => ta.Advertised && (
      ta.ToLocation?.some(tl => tl.LocationName === arrivalLocation)
      || ta.ViaToLocation?.some(vtl => vtl.LocationName === arrivalLocation)
      // :shrug:
    ) && !ta.ProductInformation?.some(pi => pi.Description === "Museitåg"))
}