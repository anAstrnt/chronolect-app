"use client";

import React, { useEffect } from "react";
import FamilyCardAria from "./FamilyCardAria/page";
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import FamilyCardMenu from "./FamilyCardMenu/page";
import { Grid } from "@mui/material";
import { useRecoilState } from "recoil";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import FirstFamilyCard from "@/app/components/familyCard/FamilyCardAria/FamilyCard";
import BackToPageButton from "@/components/BackToPageButton";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";

const page: React.FC = () => {
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

  // TODO：familyCardが登録されていなかったときの処理を、menu画面からfamilyCardに移動してきた。次はUIを整える。
  return (
    <Grid sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {hasUserData ? (
        <Grid container sx={{ width: "100%", height: "100%" }}>
          <Grid item sx={{ width: "20%", height: "100%" }}>
            <FamilyCardMenu />
          </Grid>
          <Grid item sx={{ width: "80%", height: "100%" }}>
            <BackToPageButton />
            <FamilyCardAria />
            <FamilyCardDetailAria />
          </Grid>
        </Grid>
      ) : (
        <FirstFamilyCard />
      )}
    </Grid>
  );
};

export default page;
