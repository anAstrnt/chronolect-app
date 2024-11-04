"use client";

import { Avatar, CardContent, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";
import FamilyCardAdd from "./FamilyCardAdd";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { usersState } from "@/app/states/usersState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { userIdState } from "@/app/states/userIdState";

const FamilyCard: React.FC = () => {
  const [users, setUsers] = useRecoilState(usersState);
  const hasUserData = useRecoilValue(hasUserDataState);
  const setUserId = useSetRecoilState(userIdState);

  const openUserDetail = (userId: string) => {
    setUserId(userId);
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
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid sx={{ display: "flex" }}>
        {users.map((user) => (
          <Grid
            sx={{
              maxWidth: 200,
              margin: "10px",
              border: "none",
              backgroundColor: "white",
            }}
            key={user.id}
          >
            <Grid
              onClick={() => openUserDetail(user.id)}
              sx={{
                padding: "20px 40px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Avatar
                sx={{
                  margin: "25px",
                  width: 56,
                  height: 56,
                  border: "2px solid rgba(0,0,0,0.2)",
                }}
                alt="user"
                src={user.avatar || "/images/titleLogo.png"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {user.userName || "user"}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        ))}
      </Grid>
      {!hasUserData ? <FamilyCardAdd /> : ""}
    </Grid>
  );
};

export default FamilyCard;
