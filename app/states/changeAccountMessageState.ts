import { atom } from "recoil";

export const changeAccountMessageState = atom<string>({
  key: "changeAccountMessageState",
  default: "",
});
