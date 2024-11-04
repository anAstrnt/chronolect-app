"use client";

import { Grid, IconButton } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";

const BackToPageButton = () => {
  return (
    <Link href={"/features"}>
      <Grid
        sx={{
          backgroundColor: "rgba(238,238,255,0.3)",
          borderRadius: "10px",
          position: "absolute",
        }}
      >
        <IconButton color="default" sx={{ position: "relative,", left: "5px" }}>
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
    </Link>
  );
};

export default BackToPageButton;
