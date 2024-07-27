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
      <Button variant="outlined" size="medium">
        <AddIcon />
        Create
      </Button>
      <Card sx={{ maxWidth: 250 }}>
        <CardActionArea
          sx={{
            padding: "20px 40px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{ margin: "25px", width: 56, height: 56, border: "5px solid #fff" }}
            alt="Remy Sharp"
            src="/images/titleLogo.png"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
          </CardContent>
          <CardActions color="primary">Share</CardActions>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Page;
