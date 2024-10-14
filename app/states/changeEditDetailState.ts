"use client";

import { atom } from "recoil";

export const changeEditDetailState = atom<boolean>({
  key: "changeEditDetailState",
  default: false,
});
