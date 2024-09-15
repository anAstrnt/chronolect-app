"use client";

import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type useAuthProps = {
  loading: boolean;
  authenticated: boolean;
};

// アプリ内でグローバルに認証状態管理をするためのフック
const useAuth = (): useAuthProps => {
  const router = useRouter();
  // ローディングの状態管理をするステート（初期状態：ローディング中で未認証）
  const [loading, setLoading] = useState<boolean>(true);
  // ユーザーの状態管理をするステート
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // ユーザーの認証状態をリアルタイムで取ってくる処理
    const unsubScribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        router.push("/");
      }
      setLoading(false);
    });
    return () => unsubScribe();
  }, [router]);

  return { loading, authenticated };
};

export default useAuth;
