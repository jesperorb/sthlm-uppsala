
import { writable } from "svelte/store";
import type { Locations } from "../api/Location";

const departureLocationKey = "departureLocation";

const storedDepartureLocation = localStorage.getItem(departureLocationKey);

export const departureLocation = writable<Locations>((storedDepartureLocation as Locations) || "Cst");

departureLocation.subscribe((value) => localStorage.setItem(departureLocationKey, value));

const onlyMovingoKey = "onlyMovingo";

const storedOnlyMovingo = localStorage.getItem(onlyMovingoKey) ?? "false";

export const onlyMovingo = writable<boolean>(storedOnlyMovingo === "true" ? true : false);

onlyMovingo.subscribe((value) => localStorage.setItem(onlyMovingoKey, value.toString()));

const layoutKey = "layout";

const storedLayout = localStorage.getItem(layoutKey) ?? "normal";

export const layout = writable<string>(storedLayout);

layout.subscribe((value) => localStorage.setItem(layoutKey, value));