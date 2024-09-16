"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { RecoilRoot } from "recoil";
import AuthCheck from "@/app/components/AuthCheck";

type childrenProps = {
  children: ReactNode;
};

const layout = ({ children }: childrenProps) => {
  const [background, setBackground] = useState<string>();

  useEffect(() => {
    const newDate = new Date();
    const newHours = newDate.getHours();

    if (18 >= newHours && 6 < newHours) {
      setBackground(
        "linear-gradient(90deg, rgba(141, 139, 226, 1), rgba(253, 187, 203, 1));"
      );
    } else {
      setBackground(
        "linear-gradient(90deg, rgba(196, 182, 197, 1), rgba(35, 117, 163, 1))"
      );
    }
  }, []);

  console.log(background);

  return (
    <RecoilRoot>
      <AuthCheck>
        <Grid
          container
          // justifyContent="center"
          sx={{
            width: "100%",
            minHeight: "100vh",
            backgroundImage: `${background}`,
          }}
        >
          <Grid item sx={{ width: "100%" }}>
            {children}
          </Grid>
        </Grid>
      </AuthCheck>
    </RecoilRoot>
  );
};

export default layout;
