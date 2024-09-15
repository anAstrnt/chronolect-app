"use client";

import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type useAuthProps = {
  loading: boolean;
  authenticated: boolean;
};

const useAuth = (): useAuthProps => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
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
