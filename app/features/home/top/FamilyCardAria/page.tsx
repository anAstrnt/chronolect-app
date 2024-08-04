import React from "react";
import { Grid, IconButton, Typography } from "@mui/material";
import FamilyCard from "@/app/components/top/FamilyCard";
import AddIcon from "@mui/icons-material/Add";
import FamilyCardAdd from "@/app/components/top/FamilyCardAdd";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

const Page: React.FC = () => {
  const { openInputSpace, setOpenInputSpace } = useFamilyCard();

  // デバッグ用ログ
  // console.log("users:", users);
  // console.log("userName:", userName);
  // console.log("hasUserData:", hasUserData);
  // console.log("openInputSpace:", openInputSpace);

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  return (
    <Grid sx={{ width: "100%", height: "100vh", overflow: "auto" }}>
      <Grid>
        <Typography variant="h4" component="div">
          家族メモ
        </Typography>
        <Typography variant="h6" component="div">
          様々な場面で書類作成するときのため、家族の情報をメモしておこう。
        </Typography>

        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <FamilyCard />
          <IconButton
            sx={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={openFamilyCardAddSpace}
          >
            <AddIcon />
          </IconButton>
        </Grid>

        {openInputSpace ? <FamilyCardAdd /> : ""}

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
    </Grid>
  );
};

export default Page;
