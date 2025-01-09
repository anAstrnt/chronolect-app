"use client";

import { currentPasswordState } from "@/app/states/currentPasswordState";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth } from "@/libs/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { changeAccountMessageState } from "@/app/states/changeAccountMessageState";
import { Button, Grid, Input, Typography } from "@mui/material";
import { red } from "@mui/material/colors";

const Page = () => {
  const [newEmail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] =
    useRecoilState(currentPasswordState);
  const setMessage = useSetRecoilState(changeAccountMessageState);

  async function changeUserEmail(
    currentPassword: string,
    newEmail: string
  ): Promise<void> {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User is not logged in");
    }

    try {
      // 1. 再認証
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential)
        .then(async () => {
          console.log("Auth successfully.");

          // 2. メールアドレスの更新・認証メールの送信
          await verifyBeforeUpdateEmail(user, newEmail)
            .then(() => {
              // 3. メッセージの表示と入力フォームのリセット
              setMessage(
                "新しいアドレスへメールをお送りしましたので、内容を確認し認証を行ってください。"
              );
              setErrorMessage("");
              setCurrentPassword("");
              setNewEmail("");
              console.log("Email updated and verification email sent.");
            })
            .catch((error) => {
              const errorCode = error.code;
              console.error("Error updating password:", error);
              switch (errorCode) {
                case "auth/internal-error":
                  setErrorMessage("サーバーで予期しないエラーが発生しました。");
                  break;
              }
              return;
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.error("Error updating password:", error);
          switch (errorCode) {
            case "auth/invalid-credential":
              setErrorMessage("パスワードが違います。");
              break;
          }
          return;
        });
    } catch (error) {
      console.error("Error updating email:", error);
      switch (error) {
        case "auth/invalid-credential":
          setErrorMessage("パスワードが違います。");
          break;
      }
      return;
    }
  }

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ width: "100%" }}
    >
      <Grid
        item
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 0",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ textAlign: "center", padding: "10px 0" }}>
          新しいメールアドレス
        </Typography>
        <Input
          type="email"
          placeholder="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          sx={{ width: "80%" }}
        />
      </Grid>
      <Grid
        item
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "30px 0",
        }}
      >
        <Typography sx={{ textAlign: "center" }}>パスワード：</Typography>
        <Input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </Grid>
      <Typography sx={{ textAlign: "center", color: red[500] }}>
        {errorMessage}
      </Typography>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => changeUserEmail(currentPassword, newEmail)}
          sx={{
            margin: "30px 0",
          }}
        >
          Update Email
        </Button>
      </Grid>
    </Grid>
  );
};

export default Page;
