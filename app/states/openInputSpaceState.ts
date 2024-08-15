"use client";

import { atom } from "recoil";

export const openInputSpaceState=atom<boolean>({
    key:"openInputSpaceState",
    default:false,
})