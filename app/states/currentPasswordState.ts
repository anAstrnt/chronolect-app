import { atom } from "recoil";

export const currentPasswordState = atom<string>({
  key: "currentPasswordState",
  default: "",
});
