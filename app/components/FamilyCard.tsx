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
import { collection, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";

interface FamilyCardProps {
  hasUserData: boolean;
}

const FamilyCard: React.FC<FamilyCardProps> = ({ hasUserData }) => {
  const [userName, setUserName] = useState("");
  const [openInputSpace, setOpenInputSpace] = useState(false);
  const [avatar, setAvatar] = useState("");

  const openUserCreateSpace = () => {
    setOpenInputSpace(!openInputSpace);
    console.log("in");
  };

  // サーバーサイドレンダリング（SSR）とクライアントサイドレンダリング（CSR）との間で、レンダリング結果が一致せず、エラーが発生。fetchUserNameが非同期関数のため、SSR時にundefinedが返され、CRS時にはデータが取得されるため、レンダリング結果が異なる。このエラーを解消するため、非同期処理をuseEffect内で行い、クライアントサイドでのみ実行するようにしている。
  useEffect(() => {
    const fetchUserName = async () => {
      if (hasUserData) {
        try {
          const querySnapshot = await getDocs(collection(db, "familyCard"));
          querySnapshot.forEach((doc) => {
            let fetchUserName = doc.data().userName;
            setUserName(fetchUserName);
          });
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUserName("user");
        }
      }
    };
    fetchUserName();
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
      {!hasUserData && openInputSpace ? (
        <FamilyCardAdd
          userName={userName}
          setUserName={setUserName}
          avatar={avatar}
          setAvatar={setAvatar}
        />
      ) : (
        ""
      )}
    </Grid>
  );
};

export default FamilyCard;
