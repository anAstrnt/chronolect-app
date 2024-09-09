import CategoryAddForm from "@/app/components/memo/CategoryAddForm";
import MemoByCategory from "@/app/components/memo/MemoByCategory";
import PreviewMemo from "@/app/components/memo/PreviewMemo";
import { Grid } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Grid>
      <PreviewMemo />
      <CategoryAddForm />
      <MemoByCategory />
    </Grid>
  );
};

export default page;
