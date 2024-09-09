import { atom } from "recoil";

export const urlState = atom<string>({
  key: "urlState",
  default: "",
});
