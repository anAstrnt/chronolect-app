// "use client";

import React, { useState } from "react";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import FamilyCard from "@/app/components/top/FamilyCard";
import AddIcon from "@mui/icons-material/Add";
import FamilyCardAdd from "@/app/components/top/FamilyCardAdd";
import { FamilyCardProvider, useFamilyCard } from "@/app/context/FamilyCardProvider";
import FirstFamilyCard from "@/app/components/top/FirstFamilyCard";

// type PageProps = {
//   hasUserData: boolean;
// };

// type Users = {
//   userName: string;
//   avatar: string;
// };

const Page: React.FC = () =>
  // { hasUserData }
  {
    // const [openInputSpace, setOpenInputSpace] = useState(false);
    // const [avatar, setAvatar] = useState("");
    // const [userName, setUserName] = useState("");
    // const [users, setUsers] = useState<Users[]>([]);
    const { hasUserData, openInputSpace, setOpenInputSpace } = useFamilyCard();

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  return (
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
          avatar={avatar}
          setAvatar={setAvatar}
          userName={userName}
          setUserName={setUserName}
          users={users}
          setUsers={setUsers}
        />
        <IconButton
          sx={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={openFamilyCardAddSpace}
        >
          <AddIcon />
        </IconButton>
      </Grid>
      {openInputSpace ? (
        <FamilyCardAdd
          avatar={avatar}
          setAvatar={setAvatar}
          userName={userName}
          setUserName={setUserName}
        />
      ) : (
        ""
      )}

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
  );
};

export default Page;
