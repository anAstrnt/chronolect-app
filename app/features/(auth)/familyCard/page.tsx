"use client";

import React, { useEffect, useState } from "react";
import FamilyCardDetailAria from "./FamilyCardDetailAria/page";
import FamilyCardMenu from "./FamilyCardMenu/page";
import FamilyCardHeader from "./FamilyCardHeader/page";
import { Grid } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/libs/firebase";
import CircularProgress from "@/app/components/CircularProgress";
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import BackToPageButton from "@/components/BackToPageButton";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import SelectedUserIcon from "@/app/components/familyCard/FamilyCardDetailAria/SelectedUserIcon";

const page: React.FC = () => {
  // Firestore/"familyCard"のクエリスナップショットに値が入っていたらTrue。入っていなかったらFalseを返し、ユーザーが初めてアクセスした場合に、表示する画面を切り替えられるようにしている。
  const [hasUserData, setHasUserData] = useRecoilState(hasUserDataState);
  // loading状況を格納するステート
  const [isLoading, setIsLoading] = useState(true);

  const openInputSpace = useRecoilValue(openInputSpaceState);

  // FamilyCardの初期登録が完了しているか調べる処理。
  useEffect(() => {
    // !snapshot.emptyでFirestoreのクエリスナップショットの結果が空かどうかを判定し、true（空）でないJSXで<Top /> を表示し、falseであれば、FamilyCardの登録画面<FamilyCardAdd />に飛ぶようにしている。
    const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
      setHasUserData(!snapshot.empty);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        // TODO: 色々修正が終わったらコメントアウトを外す
        overflow: "auto",
        // overflow: "hidden",
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
            <FamilyCardHeader />
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
                <FamilyCardMenu />
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
                    height: "100%",
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
          <Grid item sx={{ marginRight: "150px" }}>
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
