"use client";

import { atom } from "recoil";

export const fetchFamilyCardState = atom<boolean>({
  key: "fetchFamilyCardState",
  default: false,
});
