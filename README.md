# Stockholm - Uppsala Traffic Info

**[Live site](https://sthlm-uppsala.vercel.app/)**

> Displays traffic info for trains between Stockholm and Uppsala.

## Features

- Easy to access refresh button
- Easy to access "Change direction" button
- Toggle to show only departures where Movingo can be used
- Two layout modes: "normal" and "dense" (less padding)
- Possible to select custom date and time for when to show departures
- Link train directly to https://trafikinfo.sj.se/sv
- Dialog for extra info

## Screenshot

![Video recording of the Website Sthlm-Uppsala](https://github.com/jesperorb/sthlm-uppsala/assets/21122051/dfe47110-366c-4aeb-8ee8-1c88105a1e68)

## Running

1. Create an API-key at: https://api.trafikinfo.trafikverket.se/
2. Create an `.env` file in root folder with key: `VITE_AUTH_KEY` and set the value to your API-key.
3. `npm i`
5. `npm run dev`

## Building

2. `npm run build`

