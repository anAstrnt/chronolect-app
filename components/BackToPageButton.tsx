"use client";

import { Button, Grid, IconButton } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";
import { blueGrey } from "@mui/material/colors";

const BackToPageButton = () => {
  const color = blueGrey[500];
  return (
    <Link href={"/features"}>
      <IconButton color="default">
        <ArrowBackIosIcon />
        Back
      </IconButton>
    </Link>
  );
};

export default BackToPageButton;
