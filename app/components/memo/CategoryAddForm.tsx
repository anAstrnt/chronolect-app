"use client";

import React from "react";
// NOTE:firestoreのデータを取得するためのインポート
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
// NOTE:UIに関するインポート
import { Grid, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryNameState } from "@/app/states/categoryNameState";
import { userIdState } from "@/app/states/userIdState";
import { addCategoryState } from "@/app/states/addCategoryState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

// NOTE:カテゴリーを追加するためのコンポーネント
const CategoryAddForm = () => {
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const [addCategory, setAddCategory] = useRecoilState(addCategoryState); // カテゴリーがFirestoreに追加された時に、booleanをフックに<MemoByCategory/>のfetchCategorys();でFirestoreから最新のカテゴリーデータを取ってくる
  const [categoryName, setCategoryName] = useRecoilState(categoryNameState); // TextFieldに入力されたデータを格納するステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたMemoを表示させるためのステート

  // NOTE: 追加ボタンが押されたらFirestoreにカテゴリーデータを保存する処理
  const addCategoryNameToFirebase = async () => {
    try {
      const memoCategoryRef = doc(
        collection(db, "setMemoUser", userId, "memo", familyCardId, "category")
      );
      await setDoc(memoCategoryRef, { categoryName: categoryName });
      setAddCategory(!addCategory); // <MemoByCategory/>のfetchCategorys();でFirestoreから最新のカテゴリーデータを取ってくる
    } catch (error) {
      console.log("error:", error);
    }
    setCategoryName("");
  };

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      <Grid item>
        <TextField
          id="outlined-basic"
          label="Add Category"
          variant="outlined"
          value={categoryName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCategoryName(e.target.value)
          }
        />
        <IconButton
          onClick={addCategoryNameToFirebase}
          disabled={!categoryName}
          sx={{
            margin: "0 10px",
            backgroundColor: "rgba(255,255,255,0.7)",
          }}
        >
          <AddIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CategoryAddForm;
