"use client";

import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface useAuthProps {
  loading: boolean;
  authenticated: boolean;
}

const useAuth = (): useAuthProps => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubScribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        router.replace("/features/signIn");
      }
      setLoading(false);
    });
    return () => unsubScribe();
  }, [router]);

  return { loading, authenticated };
};

export default useAuth;
