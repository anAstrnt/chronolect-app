import { familyCardIdState } from "@/app/states/familyCardIdState";
import { usersState } from "@/app/states/usersState";
import { Avatar, Grid, Typography } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";

// NOTE：選択されたユーザーのアイコンを画面上に表示させる処理
const SelectedUserIcon = () => {
  const familyCardId = useRecoilValue(familyCardIdState);
  const users = useRecoilValue(usersState); // ユーザーデータを格納しているステート

  const selectedUser = users.find((card) => card.id === familyCardId); // userに配列メソッドを使い、user.id === userIdの条件を満たす最初の要素を返す

  // NOTE: 選択されたユーザーがいなかった場合は、nullを返す
  if (!selectedUser) return null;

  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Grid item>
        <Avatar
          sx={{
            width: "120px",
            height: "120px",
            marginBottom: "10px",
          }}
          alt={selectedUser.userName}
          src={selectedUser.avatar || "/images/titleLogo.png"}
        />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2" textAlign="center">
          {selectedUser.userName}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SelectedUserIcon;
