"use client";

import React, { useEffect, useState } from "react";
// NOTE:Firebaseのauth認証firestoreのデータを取得するためのインポート
import { db, auth } from "@/libs/firebase";
import { collection, onSnapshot } from "firebase/firestore";
// NOTE:UIに関するインポート
import { Grid } from "@mui/material";
// NOTE:各種コンポーネントのインポート
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import CircularProgress from "@/app/components/CircularProgress";
import SelectedUserIcon from "@/app/components/familyCard/FamilyCardDetailAria/SelectedUserIcon";
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import Header from "@/app/components/bar/Header";
import Side from "@/app/components/bar/Side";
import BackToPageButton from "@/components/BackToPageButton";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { userIdState } from "@/app/states/userIdState";
import { headerTitleState } from "@/app/states/headerTitleState";

// NOTE:FamilyCardページのトップコンポーネント
const Page: React.FC = () => {
  const user = auth.currentUser; // ユーザーのuidを取得するために使用
  const [userId, setUserId] = useRecoilState(userIdState); // ユーザーのuidを格納するためのステート
  // Firestore/"familyCard"のクエリスナップショットに値が入っていたらTrue。入っていなかったらFalseを返し、ユーザーが初めてアクセスした場合に、表示する画面を切り替えられるようにしている。
  const [hasUserData, setHasUserData] = useRecoilState(hasUserDataState);
  const [isLoading, setIsLoading] = useState(true); // loading状況を格納するステート
  const openInputSpace = useRecoilValue(openInputSpaceState);
  const setHeaderTitle = useSetRecoilState(headerTitleState);

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
          // スナップショットが空かどうかを確認
          if (snapshot.empty) {
            setHasUserData(false); // データがない場合
            console.log("No documents found.");
          } else {
            setHasUserData(true); // データがある場合
            console.log("Documents found.");
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching documents:", error);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      console.log("User is not.");
    }
  }, [userId]);

  useEffect(() => {
    setHeaderTitle("Family Card");
  }, []);

  // NOTE: マウント中にアイコンを表示する処理
  if (isLoading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        position: "absolute",
      }}
    >
      {hasUserData ? (
        <Grid
          container
          direction="column"
          sx={{ width: "100%", height: "100%" }}
        >
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
            <Header />
          </Grid>

          <Grid item sx={{ flexGrow: 1 }}>
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

              <Grid
                item
                sx={{
                  flexGrow: 1,
                  position: "relative",
                  width: "calc(100%-70px)",
                  height: "100%",
                }}
              >
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: "200px",
                    height: "200px",
                    margin: "100px 0 0 100px",
                    zIndex: openInputSpace ? 1 : 2, // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                    visibility: openInputSpace ? "hidden" : "visible", // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                  }}
                >
                  <Grid item>
                    <SelectedUserIcon />
                  </Grid>
                </Grid>
                <Grid
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: openInputSpace ? 2 : 1, // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                    visibility: openInputSpace ? "visible" : "hidden", // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                  }}
                >
                  <FamilyCardAdd />
                </Grid>
                <Grid
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                    zIndex: openInputSpace ? 1 : 2, // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                    visibility: openInputSpace ? "hidden" : "visible", // sideバーコンポーネントでfamilyCardを追加ポタンを押した際に表示を切り替える
                  }}
                >
                  <FamilyCardDetailAria />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ width: "100%", height: "100%" }}
        >
          <Grid
            item
            sx={{
              position: "absolute",
              top: "50%",
              left: "200px",
              transform: "translate(-50%,0)",
            }}
          >
            <BackToPageButton />
          </Grid>
          <Grid
            item
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <FamilyCardAdd />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Page;
