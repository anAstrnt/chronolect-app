"use client";

import { userDetail } from "@/types/userDetail";
import { atom } from "recoil";

export const userDetailState = atom<userDetail>({
  key: "userDetailState",
  default: {
    detailId: "",
    name: "",
    birthday: "",
    postCode: "",
    address: "",
    email: "",
  },
});
