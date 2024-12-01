"use client";

import { atom } from "recoil";

export const familyCardIdState = atom<string>({
  key: "familyCardIdState",
  default: "",
});
