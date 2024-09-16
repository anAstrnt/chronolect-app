"use client";

import React from "react";
import FamilyCardAria from "./FamilyCardAria/page";
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import { Grid } from "@mui/material";
import { useRecoilValue } from "recoil";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import FirstFamilyCard from "@/app/components/familyCard/FamilyCardAria/FamilyCard";
import BackToPageButton from "@/components/BackToPageButton";

const page: React.FC = () => {
  const hasUserData = useRecoilValue(hasUserDataState);

  return (
    <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <BackToPageButton />
      {hasUserData ? (
        <Grid>
          <FamilyCardAria />
          <FamilyCardDetailAria />
        </Grid>
      ) : (
        <FirstFamilyCard />
      )}
    </Grid>
  );
};

export default page;
