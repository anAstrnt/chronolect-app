"use client";

import { atom } from "recoil";

export const addCategoryState = atom<boolean>({
  key: "addCategoryState",
  default: false,
});
