"use client";

import React, { useState } from "react";
// NOTE:UIに関するインポート
import { Button, Grid, Input, Typography } from "@mui/material";
// NOTE:ユーザー認証に関するインポート
import { auth } from "@/libs/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
// NOTE:画面遷移するためのインポート
import Link from "next/link";

//NOTE:パスワードを忘れたユーザーにパスワード再設定メールを送信するコンポーネント
const Page = () => {
  // NOTE:ユーザーが入力したパスワード再設定メールを送るためのメールアドレスを格納するためのステート
  const [email, setEmail] = useState("");
  // NOTE:メールの送信が失敗したときにエラーメッセージを受け取るステート
  const [message, setMessage] = useState("");

  // NOTE:ユーザーがメールアドレスを入力し送信ボタンが押すと、パスワード再設定メールを送信する処理
  const sendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "ご登録されているメールアドレスにメールを送信しましたので、新しいパスワードを設定してください。"
      );
      console.log("success.");
    } catch (err) {
      console.log("error message:", err);
    }
  };

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid item sx={{ margin: "30px" }}>
        <Typography sx={{ fontSize: "30px" }}>パスワードの再設定</Typography>
      </Grid>
      <Grid
        item
        sx={{
          display: "flex",
          margin: "30px",
          padding: "50px 30px",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(225,225,225,0.5)",
        }}
      >
        <Typography sx={{ margin: "20px" }}>
          メールアドレスを入力して、送信ボタンを押してください。
        </Typography>
        <Grid item sx={{ margin: "20px" }}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ width: 400 }}
          />
          <Button
            variant="contained"
            onClick={() => sendEmail()}
            sx={{ marginLeft: "30px" }}
          >
            送信
          </Button>
        </Grid>
        <Typography sx={{ margin: "20px" }}>
          パスワードの再設定ができるURLをお送りします。
        </Typography>
        <Typography sx={{ margin: "20px", color: "red" }}>{message}</Typography>
      </Grid>
      <Grid item>
        <Link href="/features/SignIn">← Back</Link>
      </Grid>
    </Grid>
  );
};

export default Page;
