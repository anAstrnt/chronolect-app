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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

interface FamilyCardProps {
  hasUserData: boolean;
  openInputSpace: boolean;
  setOpenInputSpace: React.Dispatch<React.SetStateAction<boolean>>;
}

const FamilyCard: React.FC<FamilyCardProps> = ({
  hasUserData,
  openInputSpace,
  setOpenInputSpace,
}) => {
  const { avatar, setAvatar, userName, setUserName } = useFamilyCard();

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
            // データベースから名前を取ってくる処理
            let fetchUserName = doc.data().userName;
            setUserName(fetchUserName);
            // データベースからアバターを取ってくる処理
            let fetchAvatar = doc.data().avatar;
            setAvatar(fetchAvatar);
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
      <Card sx={{ maxWidth: 200 }}>
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
            src={avatar || "/images/titleLogo.png"}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {userName || "user"}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      {!hasUserData && openInputSpace ? <FamilyCardAdd /> : ""}
    </Grid>
  );
};

export default FamilyCard;
