"use client";

import { atom } from "recoil";

export const deleteCategoryState = atom<boolean>({
  key: "deleteCategoryState",
  default: false,
});
