"use client";

import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FamilyCardAdd from "./FamilyCardAdd";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

// type Users = {
//   userName: string;
//   avatar: string;
// };

type FamilyCardProps = {
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

const FamilyCard: React.FC<FamilyCardProps> = ({
  hasUserData,
  openInputSpace,
  setOpenInputSpace,
  avatar,
  setAvatar,
  userName,
  setUserName,
  users,
  setUsers,
}) => {
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
                  // "&::before": { width: 64, height: 64, border: "1px solid #333" },
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

      {!hasUserData && openInputSpace ? (
        <FamilyCardAdd
          avatar={avatar}
          setAvatar={setAvatar}
          userName={userName}
          setUserName={setUserName}
        />
      ) : (
        ""
      )}
    </Grid>
  );
};

export default FamilyCard;
