"use client";

import React, { useEffect } from "react";
import AddTodoAria from "./AddTodoAria/page";
import ShowTodoAria from "./ShowTodoAria/page";
import Header from "@/app/components/bar/Header/page";
import Side from "@/app/components/bar/Side/page";
import { Grid, Typography } from "@mui/material";
import SelectedUserIcon from "@/app/components/familyCard/FamilyCardDetailAria/SelectedUserIcon";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { hasUserDataState } from "@/app/states/hasUserDataState";
import { db } from "@/libs/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import FamilyCardAdd from "@/app/components/familyCard/FamilyCardAria/FamilyCardAdd";
import { userIdState } from "@/app/states/userIdState";

const page = () => {
  const openInputSpace = useRecoilValue(openInputSpaceState);
  const userId = useRecoilValue(userIdState);
  const setHasUserData = useSetRecoilState(hasUserDataState);

  // FamilyCardの初期登録が完了しているか調べる処理。
  useEffect(() => {
    // !snapshot.emptyでFirestoreのクエリスナップショットの結果が空かどうかを判定し、true（空）でないJSXで<Top /> を表示し、falseであれば、FamilyCardの登録画面<FamilyCardAdd />に飛ぶようにしている。
    const unsubscribe = onSnapshot(collection(db, "familyCard"), (snapshot) => {
      setHasUserData(!snapshot.empty);
    });
    return () => unsubscribe();
  }, []);

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

          {userId ? (
            <Grid item sx={{ width: "100%" }}>
              <Grid
                item
                container
                alignItems="center"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  margin: "100px 0 0 150px",
                  zIndex: openInputSpace ? 1 : 2,
                  visibility: openInputSpace ? "hidden" : "visible",
                }}
              >
                <Grid item>
                  <SelectedUserIcon />
                </Grid>
              </Grid>
              <Grid container sx={{ width: "100%" }}>
                <Grid
                  item
                  sx={{
                    position: "absolute",
                    top: 100,
                    bottom: 0,
                    left: 0,
                    right: 0,
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
            <Grid
              item
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>
                Selecting an icon will display information.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default page;
