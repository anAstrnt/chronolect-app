import React from "react";
import FamilyCardAria from "./FamilyCardAria/page";
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import { Grid } from "@mui/material";

const page: React.FC = () => {
  return (
    <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <FamilyCardAria />
      <FamilyCardDetailAria />
    </Grid>
  );
};

export default page;
