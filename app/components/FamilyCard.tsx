"use client";

import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FamilyCardAdd from "./FamilyCardAdd";

const FamilyCard = () => {
  const [openInputSpace, setOpenInputSpace] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatar, setAvatar] = useState("");
  const openUserCreateSpace = () => {
    setOpenInputSpace(!openInputSpace);
    console.log("in");
  };

  return (
    <Grid
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ maxWidth: 200 }}>
        <CardActionArea
          onClick={openUserCreateSpace}
          sx={{
            padding: "20px 40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              margin: "25px",
              width: 56,
              height: 56,
              border: "2px solid rgba(0,0,0,0.2)",
              // "&::before": { width: 64, height: 64, border: "1px solid #333" },
            }}
            alt="Remy Sharp"
            src={avatar || "/images/titleLogo.png"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {userName || "user"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {openInputSpace ? (
        <FamilyCardAdd
          userName={userName}
          setUserName={setUserName}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      ) : (
        ""
      )}
    </Grid>
  );
};

export default FamilyCard;
