"use client";

import React, { useEffect } from "react";
import Top from "@/app/features/(auth)/top/page";
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
import FirstFamilyCard from "@/app/components/top/FamilyCardAria/FirstFamilyCard";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { useRecoilState } from "recoil";
import { MenuData } from "@/data/MenuData";
import SignOut from "@/app/components/SignOut";

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
    // <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
    //   {hasUserData ? <Top /> : <FirstFamilyCard />}
    // </Grid>
    // TODO: TOP画面を変える
    <Grid>
      <SignOut />
      <Grid sx={{ display: "flex" }}>
        {MenuData.map((data) => (
          <Card sx={{ maxWidth: 345, margin: "10px", height: "300px" }}>
            <CardActionArea
              href={data.link}
              sx={{ height: "300px", display: "flex" }}
            >
              {React.cloneElement(data.icon, { sx: { fontSize: 100, mb: 2 } })}
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
