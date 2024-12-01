"use client";

import React, { useEffect, useState } from "react";
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import { Grid } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/libs/firebase";
import CircularProgress from "@/app/components/CircularProgress";
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import BackToPageButton from "@/components/BackToPageButton";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import SelectedUserIcon from "@/app/components/familyCard/FamilyCardDetailAria/SelectedUserIcon";
import Header from "@/app/components/bar/Header/page";
import Side from "@/app/components/bar/Side/page";
import { userIdState } from "@/app/states/userIdState";

const page: React.FC = () => {
  // Firestore/"familyCard"のクエリスナップショットに値が入っていたらTrue。入っていなかったらFalseを返し、ユーザーが初めてアクセスした場合に、表示する画面を切り替えられるようにしている。
  const [hasUserData, setHasUserData] = useRecoilState(hasUserDataState);
  // loading状況を格納するステート
  const [isLoading, setIsLoading] = useState(true);
  const openInputSpace = useRecoilValue(openInputSpaceState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const user = auth.currentUser;

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
            <Header title={"Family Card"} />
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
                    zIndex: openInputSpace ? 1 : 2,
                    visibility: openInputSpace ? "hidden" : "visible",
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
                    zIndex: openInputSpace ? 2 : 1,
                    visibility: openInputSpace ? "visible" : "hidden",
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
                    zIndex: openInputSpace ? 1 : 2,
                    visibility: openInputSpace ? "hidden" : "visible",
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

export default page;
