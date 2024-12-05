"use client";

import React from "react";
// NOTE:UIに関するインポート
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { MenuData } from "@/data/MenuData"; // NOTE:メニューデータのインポート
import SignOut from "@/app/components/SignOut"; // NOTE:サインアウトする際のコンポーネントのインポート

// NOTE:featuresのトップメニュー画面
const Page = () => {
  return (
    <Grid
      container
      flexDirection="column"
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid item sx={{ position: "absolute", zIndex: 2 }}>
        <SignOut />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
      >
        {MenuData.map((data) => (
          <Grid item key={data.link}>
            <Card
              sx={{
                maxWidth: 345,
                height: 320,
                margin: "20px",
                padding: "10px",
                width: "230px",
              }}
            >
              <CardActionArea
                href={data.link}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <CardContent>
                  {React.cloneElement(data.icon, {
                    sx: { fontSize: 70, mb: 2 },
                  })}
                </CardContent>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {data.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {data.detail}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Page;
