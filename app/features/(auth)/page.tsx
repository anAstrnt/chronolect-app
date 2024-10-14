"use client";

import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { MenuData } from "@/data/MenuData";
import SignOut from "@/app/components/SignOut";

const Page = () => {
  return (
    <Grid sx={{ position: "absolute", width: "100%" }}>
      <Grid
        sx={{
          position: "relative",
          top: "40px",
          left: "150px",
        }}
      >
        <SignOut />
      </Grid>
      <Grid
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        {MenuData.map((data) => (
          <Card
            key={data.link}
            sx={{
              maxWidth: 345,
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
                {React.cloneElement(data.icon, { sx: { fontSize: 70, mb: 2 } })}
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
        ))}
      </Grid>
    </Grid>
  );
};

export default Page;
