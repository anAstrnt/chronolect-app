"use client";

import React, { ReactNode, useEffect, useState } from "react";
// NOTE:UIに関するインポート
import { Grid } from "@mui/material";
// NOTE:Recoilに関するインポート。子コンポーネントでRecoilを使用するために必要。
import { RecoilRoot } from "recoil";
// NOTE:ユーザー認証に関するインポート
import AuthCheck from "@/app/components/AuthCheck";

type childrenProps = {
  children: ReactNode;
};

const layout = ({ children }: childrenProps) => {
  const [background, setBackground] = useState<string>();

  useEffect(() => {
    // NOTE:時間の情報を取ってくる
    const newDate = new Date();
    const newHours = newDate.getHours();

    // NOTE:サインインした時間にあわせて背景の色を変える処理
    if (18 >= newHours && 6 < newHours) {
      setBackground(
        "linear-gradient(90deg, rgba(141, 139, 226, 1), rgba(253, 187, 203, 1));"
      );
    } else {
      setBackground(
        "linear-gradient(90deg, rgba(196, 182, 197, 1), rgba(35, 117, 163, 1))"
      );
    }
  }, []);

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <RecoilRoot>
        <AuthCheck>
          <Grid
            container
            sx={{
              width: "100%",
              height: "auto",
              minHeight: "100%",
              backgroundImage: `${background}`,
            }}
          >
            <Grid item sx={{ width: "100%", height: "auto" }}>
              {children}
            </Grid>
          </Grid>
        </AuthCheck>
      </RecoilRoot>
    </Grid>
  );
};

export default layout;
