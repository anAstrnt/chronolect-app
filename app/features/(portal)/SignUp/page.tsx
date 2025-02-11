"use client";

import * as React from "react";
// NOTE:UIに関するインポート
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
const defaultTheme = createTheme();
// NOTE:ユーザー認証に関するインポート
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/libs/firebase";
// NOTE:画面遷移するためのインポート
import { useRouter } from "next/navigation";

//NOTE:新規ユーザー登録をするためのコンポーネント
const Page = () => {
  // NOTE:アカウント登録に成功したらページ遷移するためのHooks
  const router = useRouter();

  // NOTE:新規で登録するユーザーの名前・メールアドレス・パスワードを格納するステート
  const [userName, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // NOTE:ログインを失敗したときにエラーメッセージを受け取るステート
  const [errorMessageEmail, setErrorMessageEmail] = React.useState("");
  const [errorMessagePassword, setErrorMessagePassword] = React.useState("");

  // NOTE:新規ユーザーの登録処理
  const handleSubmitSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!email && !password) return;
    // 認証機能にログイン情報（email,password）を新規登録
    await createUserWithEmailAndPassword(auth, email, password)
      // 正常にログインできたときに走る処理
      .then(() => {
        // AppPageの個人画面へ遷移
        router.push(`/features`);
      })
      // 正常にログインできてなかった時に走る処理
      .catch((error) => {
        const errorCode = error.code;
        console.log({ code: errorCode });
        // エラーになった理由を表示する処理
        switch (errorCode) {
          case "auth/missing-email":
            setErrorMessageEmail("メールアドレスを入力してください。");
            break;
          case "auth/email-already-in-use":
            setErrorMessageEmail(
              "入力されたメールアドレスはすでに使用されています。"
            );
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
            setErrorMessagePassword(
              "パスワードは６文字以上で入力してください。"
            );
            break;
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {/*ブラウザのデフォルトスタイルをリセットし、MUIのテーマに基づいた基本的なスタイルを適用*/}
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
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmitSignUp}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                  value={userName}
                  autoComplete="given-name"
                  name="yourName"
                  required
                  fullWidth
                  id="yourName"
                  label="Your Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
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
                !userName || !email || !password || password.length < 6
                  ? true
                  : false
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
                <Link href="/features/SignIn" variant="body2">
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

export default Page;
