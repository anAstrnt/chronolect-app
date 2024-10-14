"use client";

import { atom } from "recoil";

export const changeQualificationsState = atom<boolean>({
  key: "changeQualificationsState",
  default: false,
});
