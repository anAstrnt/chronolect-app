"use client";

import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

const page = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);


  const handleChangeSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setIsLogin(false);
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        console.log({ code: errorCode });
      });
  };

  useEffect(() => {
    if (isLogin === false) {
      router.push("/features/SignIn");
    }
  }, [isLogin]);

  return (
    <div>
      <Button onClick={handleChangeSignOut}>Sign Out</Button>
    </div>
  );
};

export default page;
