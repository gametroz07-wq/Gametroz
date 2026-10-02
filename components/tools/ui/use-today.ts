"use client";

import { useSyncExternalStore } from "react";
import { localToday, toIsoDate } from "@/lib/tools/calendar";

const subscribeNothing = () => () => {};
const todayIso = () => toIsoDate(localToday());

/** Today's date as YYYY-MM-DD in the visitor's time zone. Empty on the server, so hydration matches. */
export function useTodayIso() {
  return useSyncExternalStore(subscribeNothing, todayIso, () => "");
}
