import { atom } from "recoil";
import { previewData } from "@/types/previewData";

export const savePreviewsState = atom<previewData[]>({
  key: "savePreviewsState",
  default: [],
});
