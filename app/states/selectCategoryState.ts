import { atom } from "recoil";

export const selectCategoryState = atom<string>({
  key: "selectCategoryState",
  default: "",
});
