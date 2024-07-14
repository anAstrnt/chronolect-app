"use client";

import * as React from "react";
// UIに関するインポート
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/libs/firebase";
import { addDoc, collection, onSnapshot, query, where } from "firebase/firestore";

const defaultTheme = createTheme();

const page = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLogin, setIsLogin] = React.useState(false);

  const handleSubmitSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLogin(true);
        const user = userCredential.user;
        console.log(user);

        const q = query(collection(db, "users"), where("email", "==", email));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          // const users = [];
          querySnapshot.forEach((doc) => {
            console.log(doc.data());
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log({ code: errorCode });
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          container
          justifyContent="center"
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url("/images/summer_top.png")',
            backgroundColor: (t) =>
              t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left",
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
            <Box component="form" noValidate onSubmit={handleSubmitSignIn} sx={{ mt: 1 }}>
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
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="./signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
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
