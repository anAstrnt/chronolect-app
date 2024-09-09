import { atom } from "recoil";
import { previewData } from "@/types/previewData";

export const previewState = atom<previewData | null>({
  key: "previewState",
  default: null,
});
