import { auth } from "@/libs/firebase";
import { childrenProps } from "@/types/childrenProps";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const user = auth.currentUser;
  console.log(user);

  return <div>{user ? "null" : "user"}</div>;
}
