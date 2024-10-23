import { atom } from "recoil";

export const birthdayState = atom<string | undefined>({
  key: "birthdayState",
  default: "",
});
