import { userIdState } from "@/app/states/userIdState";
import { usersState } from "@/app/states/usersState";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AddIcon from "@mui/icons-material/Add";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";

const page = () => {
  const users = useRecoilValue(usersState);
  const setUserId = useSetRecoilState(userIdState);
  const [openInputSpace, setOpenInputSpace] =
    useRecoilState(openInputSpaceState);

  const openUserDetail = (userId: string) => {
    setUserId(userId);
  };

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ width: "70px", height: "100%", background: "rgba(0,0,0,0.3)" }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{ width: "100%", height: "100%", marginTop: "20px" }}
      >
        {users.map((user) => (
          <Grid item key={user.id} sx={{ marginBottom: "10px" }}>
            <Button onClick={() => openUserDetail(user.id)}>
              <Avatar
                sx={{ backgroundColor: "white", width: 40, height: 40 }}
                alt="user"
                src={user.avatar || "/images/titleLogo.png"}
              />
            </Button>
          </Grid>
        ))}
        <Grid item>
          <IconButton
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "white",
              opacity: "0.3",
            }}
            onClick={() => openFamilyCardAddSpace()}
          >
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default page;
