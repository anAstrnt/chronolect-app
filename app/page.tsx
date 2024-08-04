import { auth } from "@/libs/firebase";
import { childrenProps } from "@/types/childrenProps";
import { Grid } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const user = auth.currentUser;
  console.log(user);

  return (
    <div>
      <Grid sx={{ width: "100%" }}>{user ? "null" : "user"}</Grid>
    </div>
  );
}
