"use client";

import React, { useEffect, useState } from "react";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import KeyIcon from "@mui/icons-material/Key";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import Header from "@/app/components/bar/Header";
import ChangeEmailAddress from "@/app/features/(auth)/account/ChangeEmailAddress/page";
import ChangePassword from "@/app/features/(auth)/account/ChangePassword/page";
import DeleteAccount from "@/app/features/(auth)/account/DeleteAccount/page";

import { useRecoilState, useSetRecoilState } from "recoil";
import { changeAccountMessageState } from "@/app/states/changeAccountMessageState";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { auth } from "@/libs/firebase";
import { currentPasswordState } from "@/app/states/currentPasswordState";
import { headerTitleState } from "@/app/states/headerTitleState";

const Page = () => {
  const [message, setMessage] = useRecoilState(changeAccountMessageState);
  const [openDaialog, setOpenDaialog] = useState(false);
  const [openDaialogChangeEmailAddress, setOpenDaialogChangeEmailAddress] =
    useState(false);
  const [openDaialogChangePassword, setOpenDaialogChangePassword] =
    useState(false);
  const [openDaialogDeleteAccount, setOpenDaialogDeleteAccount] =
    useState(false);
  const setCurrentPassword = useSetRecoilState(currentPasswordState);
  const user = auth.currentUser;
  const setHeaderTitle = useSetRecoilState(headerTitleState);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const buttonAray = [
    {
      setComp: "mail",
      title: "メールアドレスの変更",
      icon: <AlternateEmailIcon sx={{ width: "100px", height: "100px" }} />,
    },
    {
      setComp: "passWord",
      title: "パスワードの変更",
      icon: <KeyIcon sx={{ width: "100px", height: "100px" }} />,
    },
    {
      setComp: "account",
      title: "アカウントの削除",
      icon: <PersonOffIcon sx={{ width: "100px", height: "100px" }} />,
    },
  ];

  const handleClickOpenDaialog = (comp: string) => {
    setOpenDaialog(true);
    setMessage("");
    setCurrentPassword("");
    switch (comp) {
      case "mail":
        setOpenDaialogChangeEmailAddress(true);
        break;
      case "passWord":
        setOpenDaialogChangePassword(true);
        break;
      case "account":
        setOpenDaialogDeleteAccount(true);
        break;
    }
  };

  const handleClose = () => {
    setOpenDaialog(false);

    if (openDaialogChangeEmailAddress) {
      setOpenDaialogChangeEmailAddress(false);
    }
    if (openDaialogChangePassword) {
      setOpenDaialogChangePassword(false);
    }
    if (openDaialogDeleteAccount) {
      setOpenDaialogDeleteAccount(false);
    }
  };

  useEffect(() => {
    setHeaderTitle("Account");
  }, []);

  return (
    <Grid
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        position: "absolute",
      }}
    >
      <Grid
        sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000 }}
      >
        <Header />
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ height: "100%" }}
      >
        <Grid item sx={{ height: "50px" }}>
          <Typography>
            現在ログインしているメールアドレス：{user?.email}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            height: "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {buttonAray.map((item, index) => (
            <Card key={index} sx={{ width: 280, height: 200, margin: "50px" }}>
              <CardActionArea
                onClick={() => handleClickOpenDaialog(item.setComp)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                }}
              >
                {item.icon}
                <CardContent>
                  <Typography gutterBottom>{item.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Grid>
        <Modal open={openDaialog} onClose={handleClose}>
          <Box
            sx={{
              ...style,
              width: 500,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ textAlign: "center", fontSize: "30px" }}>
              {openDaialogChangeEmailAddress ? "メールアドレスの変更" : ""}
              {openDaialogChangePassword ? "パスワードの変更" : ""}
              {openDaialogDeleteAccount ? "アカウントの削除" : ""}
            </Typography>
            <Box
              sx={{
                width: "500px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {openDaialogChangeEmailAddress ? <ChangeEmailAddress /> : ""}
              {openDaialogChangePassword ? <ChangePassword /> : ""}
              {openDaialogDeleteAccount ? <DeleteAccount /> : ""}
              {message && <Grid>{message}</Grid>}
            </Box>
            <Button onClick={handleClose}>Cancel</Button>
          </Box>
        </Modal>
      </Grid>
    </Grid>
  );
};

export default Page;
