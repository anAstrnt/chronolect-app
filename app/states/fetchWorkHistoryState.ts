"use client";

import { atom } from "recoil";

export const fetchWorkHistoryState = atom<boolean>({
  key: "fetchWorkHistoryState",
  default: false,
});
