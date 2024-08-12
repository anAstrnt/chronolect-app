"use client";

import React, { useEffect } from "react";
import Top from "@/app/features/home/top/page";
import { Grid } from "@mui/material";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import FirstFamilyCard from "@/app/components/top/FamilyCardAria/FirstFamilyCard";
import { useFamilyCard } from "@/app/context/FamilyCardProvider";

const Page = () => {
  // Firestore/"familyCard"のクエリスナップショットに値が入っていたらTrue。入っていなかったらFalseを返し、ユーザーが初めてアクセスした場合に、表示する画面を切り替えられるようにしている。
  const { hasUserData, setHasUserData } = useFamilyCard();

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
    <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {hasUserData ? <Top /> : <FirstFamilyCard />}
    </Grid>
  );
};

export default Page;
