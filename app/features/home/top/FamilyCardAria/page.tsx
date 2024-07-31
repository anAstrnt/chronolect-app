// "use client";

import React, { useState } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import FamilyCard from "@/app/components/top/FamilyCard";
import AddIcon from "@mui/icons-material/Add";
import FamilyCardAdd from "@/app/components/top/FamilyCardAdd";
import { FamilyCardProvider } from "@/app/context/FamilyCardProvider";

interface PageProps {
  hasUserData: boolean;
}

const Page: React.FC<PageProps> = ({ hasUserData }) => {
  const [openInputSpace, setOpenInputSpace] = useState(false);

  return (
    <FamilyCardProvider>
      <Grid>
        <Typography variant="h4" component="div">
          家族メモ
        </Typography>
        <Typography variant="h6" component="div">
          様々な場面で書類作成するときのため、家族の情報をメモしておこう。
        </Typography>

        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <FamilyCard
            hasUserData={hasUserData}
            openInputSpace={openInputSpace}
            setOpenInputSpace={setOpenInputSpace}
          />
          <IconButton sx={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
            <AddIcon />
          </IconButton>
        </Grid>
        <FamilyCardAdd />

        <Grid>
          <Typography>誕生日</Typography>
          <Typography>郵便番号</Typography>
          <Typography>住所</Typography>
          <Typography>学歴</Typography>
          <Typography>職歴</Typography>
          <Typography>資格</Typography>
          <Typography>メモ</Typography>
        </Grid>
      </Grid>
    </FamilyCardProvider>
  );
};

export default Page;
