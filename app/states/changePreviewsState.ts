"use client";

import { atom } from "recoil";

export const changePreviewsState = atom<boolean>({
  key: "changePreviewsState",
  default: false,
});
