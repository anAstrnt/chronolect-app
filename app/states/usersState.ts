"use client";

import { atom } from "recoil";
import {users} from "@/types/users"

export const usersState=atom<users[]>({
    key:"usersState",
    default:[],
})