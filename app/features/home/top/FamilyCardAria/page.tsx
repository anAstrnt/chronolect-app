"use client";

import React from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import FamilyCard from "@/app/components/top/FamilyCardAria/FamilyCard";
import AddIcon from "@mui/icons-material/Add";
import FamilyCardAdd from "@/app/components/top/FamilyCardAria/FamilyCardAdd";
import { useRecoilState } from "recoil";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";

const Page: React.FC = () => {
  const [openInputSpace, setOpenInputSpace] = useRecoilState(openInputSpaceState);

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  return (
    <Grid
      sx={{
        width: "100%",
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
    </Grid>
  );
};

export default Page;
