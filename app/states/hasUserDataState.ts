"use client";

import { atom } from "recoil";

export const hasUserDataState=atom<boolean>({
    key:"hasUserDataState",
    default:false,
})