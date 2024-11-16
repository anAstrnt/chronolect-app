"use client";

import BackToPageButton from "@/components/BackToPageButton";
import { Grid, Typography } from "@mui/material";
import React from "react";

type HeaderProps = {
  title: string;
};

const page: React.FC<HeaderProps> = ({ title }) => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "50px",
        background: "rgba(0,0,0,0.3)",
        zIndex: 2000,
      }}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "15px",
          top: "5px",
        }}
      >
        <BackToPageButton />
      </Grid>
      <Grid item>
        <Typography sx={{ letterSpacing: "8px", color: "white" }}>
          Chronolect
        </Typography>
      </Grid>
      <Grid container sx={{ position: "absolute", left: "80px", top: "12px" }}>
        <Typography sx={{ letterSpacing: "8px", color: "white" }}>
          {title}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default page;
