"use client";

import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import FamilyCardAdd from "./FamilyCardAdd";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

const FamilyCard: React.FC = () => {
  const { users, setUsers, hasUserData, openInputSpace, setOpenInputSpace } =
    useFamilyCard();

  const openUserCreateSpace = () => {
    setOpenInputSpace(!openInputSpace);
  };

  useEffect(() => {
    if (hasUserData) {
      const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
        const newUsers = snapshot.docs.map((doc) => ({
          userName: doc.data().userName,
          avatar: doc.data().avatar,
        }));
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
        console.log([...users, ...newUsers]);
      });
      return () => unsubscribe();
    }
  }, [hasUserData, setUsers]);

  return (
    <Grid
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {users === undefined ||
        users.map((user) => (
          <Card sx={{ maxWidth: 200, margin: "10px" }} key={user.avatar}>
            <CardActionArea
              onClick={openUserCreateSpace}
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
                alt="Remy Sharp"
                src={user.avatar || "/images/titleLogo.png"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {user.userName || "user"}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

      {!hasUserData && openInputSpace ? <FamilyCardAdd /> : ""}
    </Grid>
  );
};

export default FamilyCard;
