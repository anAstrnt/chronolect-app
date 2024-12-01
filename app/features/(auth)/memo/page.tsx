"use client";

import React, { useEffect } from "react";
import Header from "@/app/components/bar/Header/page";
import Side from "@/app/components/bar/Side/page";
import AddMemoAria from "@/app/features/(auth)/memo/AddMemoAria/page";
import ShowMemoAria from "@/app/features/(auth)/memo/ShowMemoAria/page";
import { Grid, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import { auth, db } from "@/libs/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

const page = () => {
  const [userId, setUserId] = useRecoilState(userIdState);
  const openInputSpace = useRecoilValue(openInputSpaceState);
  const setHasUserData = useSetRecoilState(hasUserDataState);
  const user = auth.currentUser;
  const familyCardId = useRecoilValue(familyCardIdState);

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    } else {
      console.error("User is not logged in.");
    }
  }, []);

  // FamilyCardの初期登録が完了しているか調べる処理。
  useEffect(() => {
    if (userId) {
      const docRef = collection(db, "familyCards", userId, "familyCard");
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          // スナップショットが空かどうかを確認
          if (snapshot.empty) {
            setHasUserData(false); // データがない場合
            console.log("No documents found.");
          } else {
            setHasUserData(true); // データがある場合
            console.log("Documents found.");
          }
        },
        (error) => {
          console.error("Error fetching documents:", error);
        }
      );
      return () => unsubscribe();
    } else {
      console.log("User is not.");
    }
  }, [userId]);

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid
        item
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <Header title="URL Memo List" />
      </Grid>
      <Grid
        item
        sx={{
          width: "70px",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 900,
        }}
      >
        <Side />
      </Grid>

      {familyCardId ? (
        <Grid container sx={{ width: "100%", height: "100%" }}>
          {!openInputSpace ? (
            <Grid
              container
              flexDirection="column"
              sx={{
                padding: "60px 0 0 80px",
                width: "100%",
                height: "100%",
              }}
            >
              <Grid item sx={{ width: "100%", height: "150px" }}>
                {/* メモデータとカテゴリー追加のコンポーネントを表示するスペース */}
                <AddMemoAria />
              </Grid>
              <Grid item sx={{ width: "100%", height: "auto" }}>
                {/* memoのPreviewデータとカテゴリーの表示スペース */}
                <ShowMemoAria />
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: openInputSpace ? 2 : 1,
                visibility: openInputSpace ? "visible" : "hidden",
              }}
            >
              <FamilyCardAdd />
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <Grid
            item
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: openInputSpace ? 1 : 2,
              visibility: openInputSpace ? "hidden" : "visible",
            }}
          >
            <Typography>Selecting an icon will display information.</Typography>
          </Grid>
          <Grid
            item
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: openInputSpace ? 2 : 1,
              visibility: openInputSpace ? "visible" : "hidden",
            }}
          >
            <FamilyCardAdd />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default page;
