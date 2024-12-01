import { changeAccountMessageState } from "@/app/states/changeAccountMessageState";
import { currentPasswordState } from "@/app/states/currentPasswordState";
import { Button, Grid, Input, Typography } from "@mui/material";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth } from "@/libs/firebase";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const page = () => {
  const [currentPassword, setCurrentPassword] =
    useRecoilState(currentPasswordState);
  const setMessage = useSetRecoilState(changeAccountMessageState);

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
      await reauthenticateWithCredential(user, credential);

      // 2. ユーザーの削除
      await deleteUser(user);

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

export default page;
