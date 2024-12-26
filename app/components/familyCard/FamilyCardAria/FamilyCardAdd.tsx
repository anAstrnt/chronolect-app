"use client";

import React, { useState } from "react";
// NOTE:Firebaseのauth認証firestoreのデータを取得するためのインポート
import { db, storage } from "@/libs/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// NOTE:UIに関するインポート
import { Grid, TextField } from "@mui/material";
// NOTE:各種コンポーネントのインポート
import FamilyCardAddButton from "@/components/FamilyCardAddButton";
import ImageUpload from "@/components/ImageUpload";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { userNameState } from "@/app/states/userNameState";
import { openInputSpaceState } from "@/app/states/openInputSpaceState";
import { familyCardIdState } from "@/app/states/familyCardIdState";
import { avatarState } from "@/app/states/avatarState";

// NOTE: ユーザーの新規登録を行うコンポーネント。FamilyCard・Todo・Memoコンポーネントのサイドバーで＋ボタンを押すと作動する
const FamilyCardAdd: React.FC = () => {
  const [userName, setUserName] = useRecoilState(userNameState); // ユーザーの名前を格納
  const [avatar, setAvatar] = useRecoilState(avatarState); // 選ばれたアバター画像を格納 ＠ ImageUploadコンポーネントで処理
  const setOpenInputSpace = useSetRecoilState(openInputSpaceState); // Firestoreに登録が完了したら、ユーザー登録画面を閉じるためのステート
  // avatarImage：imageUploadコンポーネントからがアバター画像がアップロードされたときにFileデータを格納しておくステート。
  // ImageUploadコンポーネントで画像が選択されたときに更新され、sendUser関数内で画像をFirebase Storageにアップロードする際に使用.
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [sampleAvatarImageNum, setSampleAvatarImageNum] = useState<number>(); // ユーザーがサンプルアバターを選択した際に、そのアバターの番号を記録し、ImageUploadコンポーネントで使用するためのステート
  const [userId, setUserId] = useRecoilState(userIdState);
  const familyCardId = useRecoilValue(familyCardIdState);

  // NOTE: FamilyCardを追加する処理
  const sendUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // NOTE： 新しいFamilyCardを作った際の、DocIDを格納しておくための変数。最後の処理でサブコレクションを追加するために使用する。
    let newFamilyCardDocRef;

    // NOTE: 自分で選んだ画像をアバターに登録するときの処理
    if (avatarImage) {
      // アバター画像名にランダムな文字列を結合し、Firestrageに挙げる際に一意のURLになるようにしている。
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      const fileName = randomChar + "_" + avatarImage.name;
      const imageRef = ref(storage, `avatars/${fileName}`);
      await uploadBytes(imageRef, avatarImage);

      // NOTE: アバター画像URLとユーザー名をFirestoreに格納する処理
      try {
        const url = await getDownloadURL(ref(storage, `avatars/${fileName}`));
        newFamilyCardDocRef = await addDoc(
          collection(db, "familyCards", userId, "familyCard"),
          {
            avatar: url,
            userName: userName,
          }
        );
      } catch (error) {
        console.error(error);
      }
    }

    // NOTE: サンプルの画像をアバターに選び登録するときの処理
    if (avatar) {
      // アバター画像URLとユーザー名をFirestrageに格納する処理
      try {
        const url = await getDownloadURL(
          ref(storage, `sample_avatar/avatar${sampleAvatarImageNum}.png`)
        );
        const docRef = collection(db, "familyCards", userId, "familyCard");
        newFamilyCardDocRef = await addDoc(docRef, {
          avatar: url,
          userName: userName,
        });
      } catch (error) {
        console.error(error);
      }
    }

    // NOTE:アバター画像とユーザー名をFirestoreのcollectionにFamilyCardとして登録する際に、同時にサブコレクションとしてdetailを登録する処理
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

    console.log(newFamilyCardDocRef);

    setAvatarImage(null);
    setAvatar("");
    setUserName("");
    setOpenInputSpace(false);
    window.location.reload();
  };

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <form onSubmit={sendUser}>
        <Grid
          container
          flexDirection="column"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Grid item sx={{ width: "100%" }}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%" }}
            >
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
    </Grid>
  );
};

export default FamilyCardAdd;
