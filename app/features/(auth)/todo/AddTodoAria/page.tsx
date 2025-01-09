import TodoTitleForm from "@/app/components/todo/TodoTitleForm";
import { Grid } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <Grid
      container
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <TodoTitleForm />
    </Grid>
  );
};

export default Page;
