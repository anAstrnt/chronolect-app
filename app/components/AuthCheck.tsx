import React from "react";
import useAuth from "@/hooks/useAuth";
import Loading from "../features/AppPage/[PersonalPageId]/loading";

const AuthCheck = () => {
  // 認証したユーザーかチェックするためのカスタムフック
  const { loading, authenticated } = useAuth();

  // 画面遷移のローディング中に走る処理
  if (loading) {
    return <Loading />;
  }
  // 認証されていないユーザーがアクセスしようとすると
  if (!authenticated) {
    // 認証されていない場合は何もレンダリングしない
    return null;
  }
};

export default AuthCheck;
