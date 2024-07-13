"use client";

import * as React from "react";
// UIに関するインポート
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// ユーザー認証に関するインポート
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/libs/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const defaultTheme = createTheme();

const page = () => {
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessageEmail, setErrorMessageEmail] = React.useState("");
  const [errorMessagePassword, setErrorMessagePassword] = React.useState("");

  const handleSubmitSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await addDoc(collection(db, "users"), {
      name: userName,
      email: email,
      password: password,
    });

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage = error.message;
        console.log({ code: errorCode });

        switch (errorCode) {
          case "auth/missing-email":
            setErrorMessageEmail("メールアドレスを入力してください。");
            break;
          case "auth/email-already-in-use":
            setErrorMessageEmail("入力されたメールアドレスはすでに使用されています。");
            break;
          case "auth/invalid-email":
            setErrorMessageEmail(
              "入力されたメールアドレスは無効です。正しいメールアドレスを入力してください。"
            );
            break;
          case "auth/missing-password":
            setErrorMessagePassword("パスワードを入力してください。");
            break;
          case "auth/weak-password":
            setErrorMessagePassword("パスワードは６文字以上で入力してください。");
            break;
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmitSignIn} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  autoComplete="given-name"
                  name="yourName"
                  required
                  fullWidth
                  id="yourName"
                  label="Your Name"
                  autoFocus
                />
                {!userName ? "ユーザー名を入力してください。" : ""}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
                <Typography>{errorMessageEmail}</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                <Typography>{errorMessagePassword}</Typography>
              </Grid>
            </Grid>
            <Button
              disabled={
                !userName || !email || !password || password.length < 6 ? true : false
              }
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./signIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default page;
