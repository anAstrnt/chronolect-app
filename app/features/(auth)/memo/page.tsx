import React from "react";
import AddMemoAria from "@/app/features/(auth)/memo/AddMemoAria/page";
import ShowMemoAria from "@/app/features/(auth)/memo/ShowMemoAria/page";
import { Grid } from "@mui/material";
import BackToPageButton from "@/components/BackToPageButton";

const page = () => {
  return (
    <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      <BackToPageButton />
      <AddMemoAria />
      <ShowMemoAria />
    </Grid>
  );
};

export default page;
