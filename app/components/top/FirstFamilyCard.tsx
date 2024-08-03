import { Grid, Typography } from "@mui/material";
import React from "react";
import FamilyCard from "./FamilyCard";

// type Users = {
//   userName: string;
//   avatar: string;
// };

type FirstFamilyCardProps = {
  // hasUserData: boolean;
  // openInputSpace: boolean;
  // setOpenInputSpace: React.Dispatch<React.SetStateAction<boolean>>;
  // avatar: string;
  // setAvatar: React.Dispatch<React.SetStateAction<string>>;
  // userName: string;
  // setUserName: React.Dispatch<React.SetStateAction<string>>;
  // users: Users[];
  // setUsers: React.Dispatch<React.SetStateAction<Users[]>>;
};

const FirstFamilyCard: React.FC = ({
  // hasUserData,
  // openInputSpace,
  // setOpenInputSpace,
  // avatar,
  // setAvatar,
  // userName,
  // setUserName,
  // users,
  // setUsers,
}) => {
  return (
    <Grid
      sx={{
        width: "100%",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography>あなたの日常をメモしておくためのアプリです。</Typography>
      <Typography>まずは、あなたのアイコンと名前を登録してください。</Typography>
      <Grid>
        <FamilyCard
          // hasUserData={hasUserData}
          // openInputSpace={openInputSpace}
          // setOpenInputSpace={setOpenInputSpace}
          // avatar={avatar}
          // setAvatar={setAvatar}
          // userName={userName}
          // setUserName={setUserName}
          // users={users}
          // setUsers={setUsers}
        />
      </Grid>
    </Grid>
  );
};

export default FirstFamilyCard;
