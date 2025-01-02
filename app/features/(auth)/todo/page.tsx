"use client";

import React, { useEffect, useState } from "react";
// NOTE:Firebaseのauth認証firestoreのデータを取得するためのインポート
import { auth, db } from "@/libs/firebase";
import { collection, onSnapshot } from "firebase/firestore";
// NOTE:UIに関するインポート
import { Grid, Typography } from "@mui/material";
// NOTE:各種コンポーネントのインポート
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import AddTodoAria from "./AddTodoAria/page";
import ShowTodoAria from "./ShowTodoAria/page";
import Header from "@/app/components/bar/Header/page";
import Side from "@/app/components/bar/Side/page";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { userIdState } from "@/app/states/userIdState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

// NOTE:Todoページのトップコンポーネント
const page = () => {
  const user = auth.currentUser; // ユーザーのuidを取得するために使用
  const openInputSpace = useRecoilValue(openInputSpaceState); // SidebarでfamilyCardの追加ボタンが押されたら、FamilyCardAddコンポーネントを表示させるためのステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたTodoを表示させるためのステート
  const setHasUserData = useSetRecoilState(hasUserDataState); // familyCardにデータが保存されていたらSidebarで表示させるためのステート
  const [userId, setUserId] = useRecoilState(userIdState); // ユーザーのuidを格納するためのステート

  // NOTE:マウント時にユーザーUIDをステートにセットしておく。Authのフロント周りの処理やFirestoreのDocIdとして使用。
  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    } else {
      console.error("User is not logged in.");
    }
  }, []);

  // NOTE:FamilyCardの初期登録が完了しているか調べる処理。
  useEffect(() => {
    if (userId) {
      const docRef = collection(db, "familyCards", userId, "familyCard");
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          // スナップショットが空かどうかを確認。データが有ればSideバーにFamilyCard登録のアイコンが表示される。
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
    <Grid container direction="column" sx={{ width: "100%", height: "100%" }}>
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
        <Header title="Todo List" />
      </Grid>
      <Grid item sx={{ width: "100%", height: "100%" }}>
        <Grid container sx={{ width: "100%", height: "100%" }}>
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
            <Grid item sx={{ width: "100%" }}>
              <Grid container sx={{ width: "100%" }}>
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
                <Grid
                  container
                  sx={{
                    padding: "60px 0 0 80px",
                    width: "100%",
                    height: "100%",
                    zIndex: openInputSpace ? 1 : 2,
                    visibility: openInputSpace ? "hidden" : "visible",
                  }}
                >
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    <AddTodoAria />
                  </Grid>
                  <Grid
                    item
                    sx={{
                      display: "flex",
                      width: "100%",
                      height: "100%",
                      padding: "0 50px",
                    }}
                  >
                    <ShowTodoAria />
                  </Grid>
                </Grid>
              </Grid>
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
                <Typography>
                  Selecting an icon will display information.
                </Typography>
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
      </Grid>
    </Grid>
  );
};

export default page;
