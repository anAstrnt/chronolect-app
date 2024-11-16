"use client";

import { auth } from "@/libs/firebase";
import { Grid } from "@mui/material";
import SignIn from "@/app/features/(portal)/SignIn/page";
import { RecoilRoot } from "recoil";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "./loading";

export default function Home() {
  const router = useRouter();
  // userの認証状態を管理するステート
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    // リアルタイムで認証情報を取ってくる処理
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      // ログインされている場合はfeaturesのページに移行する
      if (currentUser) {
        router.push("/features");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <RecoilRoot>
      {/* ルートページにアクセスしたときに認証の有無を判断し、認証されている場合はfeaturesにリダイレクトし、認証されていない場合はSignInのページを表示させる */}
      <Grid container sx={{ width: "100%", height: "100%" }}>
        {user === null ? <SignIn /> : <Loading />}
      </Grid>
    </RecoilRoot>
  );
}
