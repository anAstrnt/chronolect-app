import EditButton from "@/components/EditButton";
import { Grid3x3TwoTone } from "@mui/icons-material";

import { Grid, Input, Typography } from "@mui/material";
import React from "react";
import AcademicHistory from "./AcademicHistory";
import WorkHistory from "./WorkHistory";
import { FamilyCardDetailData } from "@/data/FamilyCardDetailData";

const FamilyCardDetail = () => {
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      columns={6}
      sx={{ margin: "20px" }}
    >
      {FamilyCardDetailData.map((data) => (
        <Grid
          item
          xs={2}
          sx={{
            width: "400px",
            margin: "5px",
            padding: "20px",
            border: "1px solid #fff",
            borderRadius: "15px",
            boxShadow: 3,
          }}
          key={data.number}
        >
          <Grid sx={{ display: "flex", alignItems: "center" }}>
            <Typography>{data.detailTitle}</Typography>
            <EditButton />
          </Grid>
          <Grid sx={{ paddingLeft: "10px" }}>{data.component}</Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default FamilyCardDetail;
