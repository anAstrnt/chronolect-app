import { useFamilyCard } from "@/app/context/FamilyCardProvider";
import FamilyCardAddButton from "@/components/FamilyCardAddButton";
import ImageUpload from "@/components/ImageUpload";
import { db, storage } from "@/libs/firebase";
import { Grid, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";

const FamilyCardAdd: React.FC = () => {
  const { userName, setUserName, avatar, setAvatar, setOpenInputSpace } = useFamilyCard();
  // avatarImage：imageUploadコンポーネントからがアバター画像がアップロードされたときにFileデータを格納しておくステート。ファイルからアバター画像をアップするために格納するステート（本ステート）はsendUserのif文で画像をアップロードするために使い、それ以外はアバターのURLのみ格納するステート（avatar,setAvatar）で画像URLを管理している。
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [sampleAvatarImageNum, setSampleAvatarImageNum] = useState<number>();

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
    if (avatar) {
      getDownloadURL(ref(storage, `sample_avatar/avatar${sampleAvatarImageNum}.png`))
        .then((url) => {
          addDoc(collection(db, "familyCard"), {
            avatar: url,
            userName: userName,
          });
        })
        .catch((err) => err.message);
    }
    setAvatarImage(null);
    setAvatar("");
    setUserName("");
    setOpenInputSpace(false);
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
            <ImageUpload
              setAvatarImage={setAvatarImage}
              setSampleAvatarImageNum={setSampleAvatarImageNum}
            />
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
