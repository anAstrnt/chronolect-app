import CategoryAddForm from "@/app/components/memo/CategoryAddForm";
import MemoAddForm from "@/app/components/memo/MemoAddForm";
import { Grid } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: "100%",
        height: "auto",
      }}
    >
      <Grid item sx={{ margin: "50px 0" }}>
        <MemoAddForm />
      </Grid>
      <Grid item sx={{ margin: "50px 0" }}>
        <CategoryAddForm />
      </Grid>
    </Grid>
  );
};

export default Page;
