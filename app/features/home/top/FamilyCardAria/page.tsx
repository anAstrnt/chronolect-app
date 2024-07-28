// "use client";

import React from "react";
import AuthCheck from "@/app/components/AuthCheck";
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Page = () => {
  return (
    <Grid>
      <Typography variant="h2" component="div">
        menu Title
      </Typography>
      <Button variant="contained" size="small">
        {/* <AddIcon /> */}
        Create
      </Button>

    </Grid>
  );
};

export default Page;
