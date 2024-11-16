import { userIdState } from "@/app/states/userIdState";
import { usersState } from "@/app/states/usersState";
import { Avatar, Grid, Typography } from "@mui/material";
import React from "react";
import { useRecoilValue } from "recoil";

const SelectedUserIcon = () => {
  const userId = useRecoilValue(userIdState);
  const users = useRecoilValue(usersState);

  const selectedUser = users.find((user) => user.id === userId);

  if (!selectedUser) return null;

  return (
    <Grid
      container
      flexDirection="column"
      // justifyContent="center"
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
