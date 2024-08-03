"use client";

import React, { useEffect, useState } from "react";
import Top from "@/app/features/home/top/page";
import { Box, Button, Grid, Typography } from "@mui/material";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import FirstFamilyCard from "@/app/components/top/FirstFamilyCard";
import { FamilyCardProvider } from "@/app/context/FamilyCardProvider";

const Page = () => {
  // const [hasUserData, setHasUserData] = useState(false);
  // const { hasUserData, setHasUserData } = useFamilyCard();

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
  //     if (!snapshot.empty) {
  //       setHasUserData(true);
  //     } else {
  //       setHasUserData(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <Grid>
      <Top />
      {/* {hasUserData ? <Top /> : <FirstFamilyCard />} */}
    </Grid>
  );
};

export default Page;
