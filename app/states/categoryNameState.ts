import { atom } from "recoil";

export const categoryNameState = atom<string>({
  key: "categoryNameState",
  default: "",
});
