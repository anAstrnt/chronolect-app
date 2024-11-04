import { TodoTitleCard } from "@/app/components/todo/TodoTitleCard";
import { Grid } from "@mui/material";
import React from "react";

const page = () => {
  return (
    <Grid container sx={{ width: "100%" }}>
      <TodoTitleCard />
    </Grid>
  );
};

export default page;
