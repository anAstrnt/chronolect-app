// "use client";

import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import FamilyCard from "@/app/components/FamilyCard";

interface PageProps {
  hasUserData: boolean;
}

const Page: React.FC<PageProps> = ({ hasUserData }) => {
  return (
    <Grid>
      <Typography variant="h2" component="div">
        menu Title
      </Typography>
      <Button variant="contained" size="small">
        {/* <AddIcon /> */}
        Create
      </Button>
      <FamilyCard hasUserData={hasUserData} />
    </Grid>
  );
};

export default Page;
