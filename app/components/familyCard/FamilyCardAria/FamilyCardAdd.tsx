"use client";

import { avatarState } from "@/app/states/avatarState";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { userNameState } from "@/app/states/userNameState";
import FamilyCardAddButton from "@/components/FamilyCardAddButton";
import ImageUpload from "@/components/ImageUpload";
import { db, storage } from "@/libs/firebase";
import { Grid, TextField, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

const FamilyCardAdd: React.FC = () => {
  const [userName, setUserName] = useRecoilState(userNameState);
  const [avatar, setAvatar] = useRecoilState(avatarState);
  const setOpenInputSpace = useSetRecoilState(openInputSpaceState);
  // avatarImage：imageUploadコンポーネントからがアバター画像がアップロードされたときにFileデータを格納しておくステート。ファイルからアバター画像をアップするために格納するステート（本ステート）はsendUserのif文で画像をアップロードするために使い、それ以外はアバターのURLのみ格納するステート（avatar,setAvatar）で画像URLを管理している。
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [sampleAvatarImageNum, setSampleAvatarImageNum] = useState<number>();

  const sendUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 新しいFamilyCardを作った際の、DocIDを格納しておくための変数。最後の処理でサブコレクションを追加するために使用する。
    let newFamilyCardDocRef;

    // 自分で選んだ画像をアバターに登録するときの処理
    if (avatarImage) {
      // アバター画像名にランダムな文字列を結合し、ストレージに挙げる際に一意のURLになるようにしている。
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      const fileName = randomChar + "_" + avatarImage.name;
      const imageRef = ref(storage, `avatars/${fileName}`);
      await uploadBytes(imageRef, avatarImage);

      // アバター画像URLとユーザー名をストレージに格納する処理
      try {
        const url = await getDownloadURL(ref(storage, `avatars/${fileName}`));
        newFamilyCardDocRef = await addDoc(collection(db, "familyCard"), {
          avatar: url,
          userName: userName,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // サンプルの画像をアバターに選び登録するときの処理
    if (avatar) {
      // アバター画像URLとユーザー名をストレージに格納する処理
      try {
        const url = await getDownloadURL(
          ref(storage, `sample_avatar/avatar${sampleAvatarImageNum}.png`)
        );
        newFamilyCardDocRef = await addDoc(collection(db, "familyCard"), {
          avatar: url,
          userName: userName,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // アバター画像とユーザー名をストレージのコレクションにFamilyCardとして登録する際に、同時にサブコレクションとしてdetailを登録する処理
    if (newFamilyCardDocRef) {
      const detailCollectionRef = collection(newFamilyCardDocRef, "detail");
      await addDoc(detailCollectionRef, {
        name: "",
        birthday: "",
        postCode: "",
        address: "",
        qualification: "",
        email: "",
      });
    }

    setAvatarImage(null);
    setAvatar("");
    setUserName("");
    setOpenInputSpace(false);
  };

  return (
    <form onSubmit={sendUser}>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Grid item>
          <Grid container alignItems="center">
            <Grid item sx={{ margin: "40px" }}>
              <TextField
                id="standard-basic"
                label="name"
                variant="standard"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                sx={{ margin: "40px 20px 0 0", width: "300px" }}
              />
            </Grid>
            <Grid item sx={{ margin: "40px" }}>
              <ImageUpload
                setAvatarImage={setAvatarImage}
                setSampleAvatarImageNum={setSampleAvatarImageNum}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={{ margin: "50px" }}>
          <FamilyCardAddButton />
        </Grid>
      </Grid>
    </form>
  );
};

export default FamilyCardAdd;
