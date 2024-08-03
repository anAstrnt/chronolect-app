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

  // サーバーサイドレンダリング（SSR）とクライアントサイドレンダリング（CSR）との間で、レンダリング結果が一致せず、エラーが発生。fetchUserDataが非同期関数のため、SSR時にundefinedが返され、CRS時にはデータが取得されるため、レンダリング結果が異なる。このエラーを解消するため、非同期処理をuseEffect内で行い、クライアントサイドでのみ実行するようにしている。
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasUserData) {
        try {
          const querySnapshot = await getDocs(collection(db, "familyCard"));
          querySnapshot.forEach((doc) => {
            const newUsers = {
              userName: doc.data().userName,
              avatar: doc.data().avatar,
            };
            setUsers([newUsers, ...users]);

            // データベースから名前を取ってくる処理
            // let fetchUserName = doc.data().userName;
            // setUserName(fetchUserName);
            // // データベースからアバターを取ってくる処理
            // let fetchAvatar = doc.data().avatar;
            // setAvatar(fetchAvatar);
          });
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUserName("user");
          setAvatar("/images/titleLogo.png");
        }
      }
    };
    fetchUserData();
  }, [hasUserData]);

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
  //     const newUsers = snapshot.docs.map((doc) => ({
  //       userName: doc.data().userName,
  //       avatar: doc.data().avatar,
  //     }));
  //     console.log([newUsers, ...users]);
  //     setUsers([newUsers, ...users]);
  //   });

  //   return () => unsubscribe();
  // }, [hasUserData]);

  return (
    <Grid
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {users.map((user) => (
        <Card sx={{ maxWidth: 200 }} key={user.avatar}>
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
