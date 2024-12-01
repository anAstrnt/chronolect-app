"use client";

import * as React from "react";
// NOTE:UIに関するインポート
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typewriter from "typewriter-effect";
const defaultTheme = createTheme();
// NOTE:ユーザー認証に関するインポート
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/libs/firebase";
// NOTE:画面遷移するためのインポート
import { useRouter } from "next/navigation";

//NOTE:登録済みのユーザーがログインをするためのコンポーネント
const page = () => {
  const router = useRouter();
  // NOTE:ログインするメールアドレス・パスワードを格納するステート
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // NOTE:ログインを失敗したときにエラーメッセージを受け取るステート
  const [errorMessageEmail, setErrorMessageEmail] = React.useState("");
  const [errorMessagePassword, setErrorMessagePassword] = React.useState("");

  // NOTE:sign―inのボタンが押されたときに走る処理（ログイン）
  const handleSubmitSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      // 正常にログインできたときに走る処理
      .then(() => {
        router.push(`/features`);
      })
      // 正常にログインできてなかった時に走る処理
      .catch((error) => {
        const errorCode = error.code;
        console.log({ code: errorCode });
        // エラーになった理由を表示する処理
        switch (errorCode) {
          case "auth/invalid-email":
            setErrorMessageEmail(
              "入力されたメールアドレスは無効です。正しいメールアドレスを入力してください。"
            );
            break;
          case "auth/invalid-credential":
            setErrorMessagePassword(
              "パスワードが登録されているものと異なります。"
            );
            break;
        }
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ width: "100%", height: "100vh" }}>
        {/*ブラウザのデフォルトスタイルをリセットし、MUIのテーマに基づいた基本的なスタイルを適用*/}
        <CssBaseline />
        <Grid
          item
          container
          justifyContent="center"
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "500px",
              height: "500px",
              backgroundImage: 'url("/images/chronolect.png")',
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              animation: "moveBackground 10s linear infinite",
              zIndex: -1,
            },
            "@keyframes moveBackground": {
              "0%": { transform: "translate(-50%, -50%) translateY(0)" },
              "50%": { transform: "translate(-50%, -50%) translateY(10%)" },
              "100%": { transform: "translate(-50%, -50%) translateY(0)" },
            },
            zIndex: -2,
          }}
        >
          <Box sx={{ fontSize: 36, my: 16, mx: 12 }}>
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    '<strong><span style="font-size:52px;">Welcome</span> to <span style="color: #50C4FF; font-size:76px;">Chronolect!</span></strong>'
                  )
                  .start();
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmitSignIn}
              sx={{ mt: 1 }}
            >
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Typography>{errorMessageEmail}</Typography>
              <TextField
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Typography>{errorMessagePassword}</Typography>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs sx={{ margin: "10px" }}>
                  <Link href="/features/ForgotPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item sx={{ margin: "10px" }}>
                  <Link href="/features/SignUp" variant="body2">
                    {"Don't have an account?"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default page;
