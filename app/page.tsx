"use client";

import { useEffect, useState } from "react";
// NOTE:UIに関するインポート
import { Grid } from "@mui/material";
// NOTE:ユーザー認証に関するインポート
import { auth } from "@/libs/firebase";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import SignIn from "@/app/features/(portal)/SignIn/page";
import Loading from "./loading";

// NOTE:最上位コンポーネント。Recoilのルート設定やログインの有無判定をしている。
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
    <Grid container sx={{ width: "100%", height: "100%" }}>
      {/* ルートページにアクセスしたときに認証の有無を判断し、認証されている場合はfeaturesにリダイレクトし、認証されていない場合はSignInのページを表示させる */}
      {user === null ? <SignIn /> : <Loading />}
    </Grid>
  );
}
