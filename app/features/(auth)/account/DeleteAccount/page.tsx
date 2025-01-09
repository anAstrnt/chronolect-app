"use client";

import { currentPasswordState } from "@/app/states/currentPasswordState";
import { Button, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { auth } from "@/libs/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { red } from "@mui/material/colors";

const Page = () => {
  const [currentPassword, setCurrentPassword] =
    useRecoilState(currentPasswordState);
  const [errorMessage, setErrorMessage] = useState("");

  async function changeDeleteAccount(currentPassword: string): Promise<void> {
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

          // 2. ユーザーの削除
          await deleteUser(user)
            .then(() => {
              console.log("Delete User successfully.");
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
          onClick={() => changeDeleteAccount(currentPassword)}
          sx={{
            margin: "30px 0",
          }}
        >
          Delete Account
        </Button>
      </Grid>
    </Grid>
  );
};

export default Page;
