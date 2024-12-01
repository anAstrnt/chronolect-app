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
import { Button, Grid, Input, Typography } from "@mui/material";

const page = () => {
  const [newPassword, setNewPassword] = useState("");
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
      await reauthenticateWithCredential(user, credential);

      // 2. パスワードの更新
      await updatePassword(user, newPassword);

      // 3. メッセージの表示と入力フォームのリセット
      setMessage("新しいパスワードに変更されました");
      setCurrentPassword("");
      setNewPassword("");

      console.log("Password updated successfully.");
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
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
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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

export default page;
