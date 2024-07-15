import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const useAuth = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubScribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        router.replace("/features/SignIn");
      }
      setLoading(false);
    });
    return () => unsubScribe();
  }, [router]);
  return { loading, authenticated };
};

export default useAuth;
