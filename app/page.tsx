"use client";

import { auth } from "@/libs/firebase";
import { Grid } from "@mui/material";
import SignIn from "@/app/features/(portal)/SignIn/page";
import { RecoilRoot } from "recoil";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const user = auth.currentUser;
    setUser(user);
    if (user) {
      router.push("/features");
    }
  }, []);

  return (
    <div>
      <RecoilRoot>
        <Grid sx={{ width: "100%" }}>{user ? "null" : <SignIn />}</Grid>
      </RecoilRoot>
    </div>
  );
}
