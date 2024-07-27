import React from "react";
import useAuth from "@/hooks/useAuth";
import Loading from "../features/home/loading";
import { childrenProps } from "@/types/childrenProps";
import SignIn from "@/app/features/signIn/page";

const AuthCheck = ({ children }: childrenProps) => {
  console.log("authCheck");
  // 認証したユーザーかチェックするためのカスタムフック
  const { loading, authenticated } = useAuth();

  // 画面遷移のローディング中に走る処理
  if (loading) {
    return <Loading />;
  }
  // 認証されていないユーザーがアクセスしようとするとはじく処理
  if (!authenticated) {
    // 認証されていない場合は何もレンダリングしない
    return <SignIn />;
  }
  return <>{children}</>;
};

export default AuthCheck;
