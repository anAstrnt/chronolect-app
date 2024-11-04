"use client";

import { userIdState } from "@/app/states/userIdState";
import { usersState } from "@/app/states/usersState";
import { Avatar, Button, Grid, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import AddIcon from "@mui/icons-material/Add";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";

const page = () => {
  const hasUserData = useRecoilValue(hasUserDataState);
  const [users, setUsers] = useRecoilState(usersState);
  const setUserId = useSetRecoilState(userIdState);
  const [openInputSpace, setOpenInputSpace] =
    useRecoilState(openInputSpaceState);

  const openUserDetail = (userId: string) => {
    setUserId(userId);
    setOpenInputSpace(false);
  };

  const openFamilyCardAddSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  useEffect(() => {
    if (hasUserData) {
      const unsubscribe = onSnapshot(
        collection(db, "familyCard"),
        (snapshot) => {
          const newUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            userName: doc.data().userName,
            avatar: doc.data().avatar,
          }));
          setUsers(newUsers);
        }
      );
      return () => unsubscribe();
    }
  }, [hasUserData]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.3)",
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        sx={{
          width: "100%",
          height: "100%",
          marginTop: "70px",
        }}
      >
        {users.map((user) => (
          <Grid item key={user.id} sx={{ marginBottom: "10px" }}>
            <Button
              onClick={() => openUserDetail(user.id)}
              sx={{
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&:hover .MuiAvatar-root": {
                  transform: "scale(1.4)",
                },
                "&:active .MuiAvatar-root": {
                  transform: "scale(1.2)",
                },
              }}
            >
              <Avatar
                sx={{
                  backgroundColor: "white",
                  width: 40,
                  height: 40,
                  transition: "transform 0.2s",
                }}
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
              transition: "opacity 0.3s, background-color 0.3s",
              "&:hover": {
                backgroundColor: "white",
                opacity: 1,
              },
              "& .MuiSvgIcon-root": {
                transition: "color 0.3s",
              },
              "&:hover .MuiSvgIcon-root": {
                color: "primary.main", // または任意の明るい色
              },
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
