"use client";

import React, { Suspense } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import useAuth from "@/hooks/useAuth";

import Loading from "./loading";

const page = () => {
  // 認証したユーザーかチェックするためのカスタムフック
  const { loading, authenticated } = useAuth();

  const handleChangeSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        console.log({ code: errorCode });
      });
  };

  // PersonalPageへ画面遷移のローディング中に走る処理
  if (loading) {
    return <Loading />;
  }
  // 認証されていないユーザーがPersonalPage以下にアクセスしようとすると
  if (!authenticated) {
    // 認証されていない場合は何もレンダリングしない
    return null;
  }

  return (
    <div>
      <Button onClick={handleChangeSignOut}>Sign Out</Button>
    </div>
  );
};

export default page;
