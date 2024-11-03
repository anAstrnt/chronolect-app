import { workHistoryItemsTypes } from "@/types/workHistoryItemTypes";
import { atom } from "recoil";

export const workHistoryItemsState = atom<workHistoryItemsTypes[]>({
  key: "workHistoryItemsState",
  default: [],
});
