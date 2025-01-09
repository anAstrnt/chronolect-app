"use client";

import BackToPageButton from "@/components/BackToPageButton";
import { Grid, Typography } from "@mui/material";
import React from "react";
import Tips from "@/app/components/bar/Tips/page";

type HeaderProps = {
  title: string;
};

// NOTE:FamilyCard.Todo.Memoの上部に表示させるコンポーネント
// NOTE:今いるコンポーネント名を表示・Tipsの表示・メニューへ戻るボタンの表示をしている。
const Page: React.FC<HeaderProps> = ({ title }) => {
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
        item
        container
        sx={{
          position: "absolute",
          left: "15px",
          top: "5px",
        }}
      >
        <BackToPageButton />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ margin: "0 100px" }}
      >
        <Grid item>
          <Typography sx={{ letterSpacing: "8px", color: "white" }}>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography sx={{ letterSpacing: "8px", color: "white" }}>
            Chronolect
          </Typography>
        </Grid>
        <Grid item>
          <Tips title={title} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Page;
