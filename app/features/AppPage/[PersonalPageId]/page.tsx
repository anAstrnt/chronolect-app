"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { Button } from "@mui/material";
import AuthCheck from "@/app/components/AuthCheck";

const Page = () => {
  // 認証しているユーザーかチェックする関数コンポーネント
  AuthCheck();

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

  return <div>Page</div>;
};

export default Page;
