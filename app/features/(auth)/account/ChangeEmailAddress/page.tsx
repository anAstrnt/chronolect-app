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

const page = () => {
  const [newEmail, setNewEmail] = useState("");
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
      await reauthenticateWithCredential(user, credential);

      // 2. メールアドレスの更新・認証メールの送信
      await verifyBeforeUpdateEmail(user, newEmail);

      // 3. メッセージの表示と入力フォームのリセット
      setMessage(
        "新しいアドレスへメールをお送りしましたので、内容を確認し認証を行ってください。"
      );
      setCurrentPassword("");
      setNewEmail("");

      console.log("Email updated and verification email sent.");
    } catch (error) {
      console.error("Error updating email:", error);
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

export default page;
