import React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import { Grid, Typography } from "@mui/material";

const WorkHistory = () => {
  return (
    <Grid container sx={{ margin: "20px 0 20px 0" }}>
      <Grid container justifyContent="space-around">
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "200px",
            margin: "10px 0 10px 0",
          }}
        >
          <Grid item sx={{ marginRight: "10px" }}>
            {/* <Typography>{item.contentStart}</Typography> */}
          </Grid>
          {/* <Grid item>{item.contentStartDate}</Grid> */}
        </Grid>

        <Grid item sx={{ display: "flex", margin: "10px 0 10px 0" }}>
          <Typography>ー</Typography>
        </Grid>

        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "200px",
            margin: "10px 0 10px 0",
          }}
        >
          <Grid item sx={{ marginRight: "10px" }}>
            {/* <Typography>{item.contentEnd}</Typography> */}
          </Grid>
          {/* <Grid item>{item.contentEndDate}</Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WorkHistory;
