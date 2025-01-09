import { TodoTitleCard } from "@/app/components/todo/TodoTitleCard";
import { Grid } from "@mui/material";
import React from "react";

const Page = () => {
  return (
    <Grid container sx={{ width: "100%" }}>
      <TodoTitleCard />
    </Grid>
  );
};

export default Page;
