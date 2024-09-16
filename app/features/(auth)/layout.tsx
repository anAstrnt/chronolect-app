"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { RecoilRoot } from "recoil";
import AuthCheck from "@/app/components/AuthCheck";
import { useRouter } from "next/navigation";

type childrenProps = {
  children: ReactNode;
};

const layout = ({ children }: childrenProps) => {
  const router = useRouter();
  const [background, setBackground] = useState<string>();

  useEffect(() => {
    const newDate = new Date();
    const newHours = newDate.getHours();

    if (18 > newHours && 6 < newHours) {
      setBackground("/images/morning.png");
    } else {
      setBackground("/images/night.png");
    }
  }, []);

  return (
    <RecoilRoot>
      <AuthCheck>
        <Grid
          container
          justifyContent="center"
          sx={{
            width: "100%",
            minHeight: "100vh",
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Grid item sx={{ width: "1200px" }}>
            {children}
          </Grid>
        </Grid>
      </AuthCheck>
    </RecoilRoot>
  );
};

export default layout;
