import { Grid, Typography } from "@mui/material";
import React from "react";
import MemoSlider from "./MemoSlider";

const MemoPreview = () => {
  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid
        item
        sx={{
          borderRadius: "30px",
          minHeight: "300px",
          width: "100%",
          height: "400px",
          margin: "10px 0",
          position: "relative",
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center", margin: "15px 0" }}>
          PreviewAria
        </Typography>
        <Grid item sx={{ margin: "0px 30px" }}>
          <MemoSlider selectCategory="" />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MemoPreview;
