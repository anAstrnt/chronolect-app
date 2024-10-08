"use client";

import React, { useEffect, useState } from "react";
import Top from "@/app/features/(auth)/familyCard/page";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import FirstFamilyCard from "@/app/components/familyCard/FamilyCardAria/FirstFamilyCard";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { useRecoilState } from "recoil";
import { MenuData } from "@/data/MenuData";
import SignOut from "@/app/components/SignOut";
import { useRouter } from "next/navigation";

const Page = () => {
  // Firestore/"familyCard"のクエリスナップショットに値が入っていたらTrue。入っていなかったらFalseを返し、ユーザーが初めてアクセスした場合に、表示する画面を切り替えられるようにしている。
  const [hasUserData, setHasUserData] = useRecoilState(hasUserDataState);

  useEffect(() => {
    // FamilyCardの初期登録が完了しているか調べる処理。
    // !snapshot.emptyでFirestoreのクエリスナップショットの結果が空かどうかを判定し、true（空）でないJSXで<Top /> を表示し、falseであれば、FamilyCardの初期登録画面<FirstFamilyCard />に飛ぶようにしている。
    const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
      if (!snapshot.empty) {
        setHasUserData(true);
      } else {
        setHasUserData(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Grid sx={{ width: "100%" }}>
      <Grid sx={{ position: "relative", marginTop: "100px" }}>
        <SignOut />
      </Grid>
      <Grid
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        {MenuData.map((data) => (
          <Card
            key={data.link}
            sx={{
              maxWidth: 345,
              margin: "20px",
              padding: "10px",
              width: "230px",
            }}
          >
            <CardActionArea
              href={data.link}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <CardContent>
                {React.cloneElement(data.icon, { sx: { fontSize: 70, mb: 2 } })}
              </CardContent>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {data.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {data.detail}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default Page;
