"use client";

import { currentPasswordState } from "@/app/states/currentPasswordState";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth } from "@/libs/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { changeAccountMessageState } from "@/app/states/changeAccountMessageState";
import { Button, Grid, Input, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";

const Page = () => {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] =
    useRecoilState(currentPasswordState);
  const setMessage = useSetRecoilState(changeAccountMessageState);

  async function changeUserPassword(
    currentPassword: string,
    newPassword: string
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

          // 2. パスワードの更新
          await updatePassword(user, newPassword)
            .then(() => {
              // 3. メッセージの表示と入力フォームのリセット
              setMessage("新しいパスワードに変更されました");
              setCurrentPassword("");
              setNewPassword("");
              setErrorMessage("");
              console.log("Password updated successfully.");
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
      console.error("Error updating password:", error);
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
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          現在のパスワード：
        </Typography>
        <TextField
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentPassword(e.target.value)
          }
        />
      </Grid>
      <Typography sx={{ textAlign: "center", color: red[500] }}>
        {errorMessage}
      </Typography>
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
        <Typography
          sx={{
            textAlign: "center",
          }}
        >
          新しいパスワード：
        </Typography>
        <TextField
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPassword(e.target.value)
          }
        />
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => changeUserPassword(currentPassword, newPassword)}
          sx={{
            margin: "30px 0",
          }}
        >
          Update Password
        </Button>
      </Grid>
    </Grid>
  );
};

export default Page;
