import { memoCategorysTypes } from "@/types/memoCategorysTypes";
import { atom } from "recoil";

export const memoCategorysState = atom<memoCategorysTypes[]>({
  key: "memoCategorysState",
  default: [],
});
