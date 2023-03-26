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

<img width="357" alt="Screenshot 2023-03-26 at 15 18 59" src="https://user-images.githubusercontent.com/21122051/227778343-b30070d1-cd45-497f-9c65-c26b281c9f5d.png">

## Running

1. Create an API-key at: https://api.trafikinfo.trafikverket.se/
2. Create an `.env` file in root folder with key: `VITE_AUTH_KEY` and set the value to your API-key.
3. `npm i`
5. `npm run dev`

## Building

2. `npm run build`

