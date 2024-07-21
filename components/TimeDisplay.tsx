"use client";

import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {
  locale?: string;
};

const TimeDisplay = ({ locale = "ja-JP" }: Props) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Grid
      sx={{
        width: "200px",
        height: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "20px",
        backgroundImage: 'url("/images/timeBackgroundImage.png")',
        backgroundSize: "120%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          letterSpacing: 6,
          width: "100%",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        {date.toLocaleDateString(locale)}
      </Box>
      <Box
        sx={{
          fontWeight: "bold",
          fontSize: 48,
          letterSpacing: 6,
          width: "100%",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        {date.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: undefined,
        })}
      </Box>
    </Grid>
  );
};

export default TimeDisplay;
