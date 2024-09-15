"use client";

import { Button, Grid, IconButton } from "@mui/material";
import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";

const BackToPageButton = () => {
  return (
    <Link href={"/features"}>
      <IconButton color="secondary">
        <ArrowBackIosIcon />
        Back
      </IconButton>
    </Link>
  );
};

export default BackToPageButton;
