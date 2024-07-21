"use client";

import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

const SignOut = () => {
  const handleChangeSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        const errorCode = error.code;
        console.log({ code: errorCode });
      });
  };

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 200,
        bgcolor: "background.paper",
        padding: 0,
        marginTop: "10px",
        marginBottom: "10px",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton onClick={handleChangeSignOut}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Sign Out" />
      </ListItemButton>
    </List>
  );
};

export default SignOut;
