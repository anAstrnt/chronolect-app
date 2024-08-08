import React, { useState } from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import FamilyCard from "@/app/components/top/FamilyCard";
import AddIcon from "@mui/icons-material/Add";
import FamilyCardAdd from "@/app/components/top/FamilyCardAdd";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import FamilyCardDetail from "@/app/components/top/FamilyCardDetail";

const Page: React.FC = () => {
  const { openInputSpace, setOpenInputSpace } = useFamilyCard();

  // デバッグ用ログ
  // console.log("users:", users);
  // console.log("userName:", userName);
  // console.log("hasUserData:", hasUserData);
  // console.log("openInputSpace:", openInputSpace);

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Grid>
        <Typography variant="h4" component="div">
          家族メモ
        </Typography>
        <Typography variant="h6" component="div">
          様々な場面で書類作成するときのため、家族の情報をメモしておこう。
        </Typography>
      </Grid>

      <Grid
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <FamilyCard />
        <IconButton
          sx={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={openFamilyCardAddSpace}
        >
          <AddIcon />
        </IconButton>
      </Grid>

      {openInputSpace ? <FamilyCardAdd /> : ""}

      <Typography variant="h6" component="div">
        選択されたカードの情報を表示します。
      </Typography>
      <FamilyCardDetail  />
    </Grid>
  );
};

export default Page;
