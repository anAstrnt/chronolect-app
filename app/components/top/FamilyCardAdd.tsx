import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import FamilyCardAddButton from "@/components/FamilyCardAddButton";
import ImageUpload from "@/components/ImageUpload";
import { db, storage } from "@/libs/firebase";
import { Grid, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";

const FamilyCardAdd: React.FC = () => {
  const { userName, setUserName } = useFamilyCard();
  // imageUploadコンポーネントからがアバター画像がアップロードされたときにFileデータを格納しておくステート
  const [avatarImage, setAvatarImage] = useState<File | null>(null);

  const sendUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (avatarImage) {
      const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      const fileName = randomChar + "_" + avatarImage.name;
      const imageRef = ref(storage, `avatars/${fileName}`);
      await uploadBytes(imageRef, avatarImage);

      getDownloadURL(ref(storage, `avatars/${fileName}`))
        .then((url) => {
          addDoc(collection(db, "familyCard"), {
            avatar: url,
            userName: userName,
          });
        })
        .catch((err) => err.message);
    }
    setAvatarImage(null);
    setUserName("");
  };

  return (
    <form onSubmit={sendUser}>
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid sx={{ display: "flex" }}>
          <Grid>
            <Typography sx={{ fontSize: 25, fontWeightBold: 500 }}>User Name</Typography>
            <TextField
              id="standard-basic"
              label="name"
              variant="standard"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{ margin: "40px 20px 0 0", width: "300px" }}
            />
          </Grid>
          <Grid>
            <Typography sx={{ fontSize: 25, fontWeightBold: 500 }}>
              Choose your avatar
            </Typography>
            <ImageUpload setAvatarImage={setAvatarImage} />
          </Grid>
        </Grid>
        <Grid sx={{ margin: "50px" }}>
          <FamilyCardAddButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default FamilyCardAdd;
