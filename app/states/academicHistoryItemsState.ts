import { academicHistoryItemsTypes } from "@/types/academicHistoryItemTypes";
import { atom } from "recoil";

export const academicHistoryItemsState = atom<academicHistoryItemsTypes[]>({
  key: "academicHistoryItemsState",
  default: [],
});
