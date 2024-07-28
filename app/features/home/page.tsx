"use client";

import React, { useEffect, useState } from "react";
import Top from "@/app/features/home/top/page";
import { Box, Button, Grid, Typography } from "@mui/material";
import FamilyCard from "@/app/components/FamilyCard";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";

const Page = () => {
  const [hasUserData, setHasUserData] = useState(false);

  useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
        if (!snapshot.empty) {
          setHasUserData(true);
        } else {
          setHasUserData(false);
        }
      });

    return () => unsubscribe();
  }, []);

  return (
    <Grid>
      {hasUserData?(<Top/>):(
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
      )}
    </Grid>
  );
};

export default Page;
