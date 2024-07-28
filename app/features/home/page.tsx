import React from "react";
import Top from "@/app/features/home/top/page";
import { Box, Button, Grid, Typography } from "@mui/material";
import FamilyCard from "@/app/components/FamilyCard";

const Page = () => {
  return (
    <Grid
      sx={{
        width: "100%",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography>あなたの日常をメモしておくためのアプリです。</Typography>
      <Typography>まずは、あなたのアイコンと名前を登録してください。</Typography>
      <Grid>
        <FamilyCard />
      </Grid>
    </Grid>
  );
};

export default Page;
