import { auth } from "@/libs/firebase";
import styles from "./page.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Home() {
  onAuthStateChanged(auth, (user) => {
    console.log(user);
  });

  return <div></div>;
}
