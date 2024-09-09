import { atom } from "recoil";

export const memoState = atom<string>({
  key: "memoState",
  default: "",
});
