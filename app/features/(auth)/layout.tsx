"use client";

import React, { ReactNode } from "react";
import { Grid } from "@mui/material";
import { RecoilRoot } from "recoil";
import AuthCheck from "@/app/components/AuthCheck";

type childrenProps = {
  children: ReactNode;
};

const layout = ({ children }: childrenProps) => {
  return (
    <RecoilRoot>
      <AuthCheck>
        <Grid
          container
          justifyContent="center"
          sx={{
            width: "100%",
            minHeight: "100vh",
            padding: "20px",
            backgroundImage: "url('/images/morning.png')",
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
