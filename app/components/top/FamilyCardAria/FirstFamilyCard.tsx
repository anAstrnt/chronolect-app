import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import FamilyCard from "./FamilyCard";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import FamilyCardAdd from "./FamilyCardAdd";

const FirstFamilyCard: React.FC = () => {
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
        <FamilyCardAdd />
      </Grid>
    </Grid>
  );
};

export default FirstFamilyCard;
