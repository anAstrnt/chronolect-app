import CategoryAddForm from "@/app/components/memo/CategoryAddForm";
import MemoByCategory from "@/app/components/memo/MemoByCategory";
import MemoPreview from "@/app/components/memo/MemoPreview";
import { Grid } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid item sx={{ width: "calc(100vw - 150px)", height: "auto" }}>
        <MemoPreview />
      </Grid>
      <Grid
        item
        sx={{ width: "calc(100vw - 150px)", height: "auto", margin: "0 30px" }}
      >
        <MemoByCategory />
      </Grid>
    </Grid>
  );
};

export default Page;
