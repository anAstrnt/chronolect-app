import { Grid, IconButton, TextField } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRecoilState, useRecoilValue } from "recoil";
import { categoryNameState } from "@/app/states/categoryNameState";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { userIdState } from "@/app/states/userIdState";
import { addCategoryState } from "@/app/states/addCategoryState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

const CategoryAddForm = () => {
  const userId = useRecoilValue(userIdState); // 選択されたUserのIdを取ってくるステート
  const [addCategory, setAddCategory] = useRecoilState(addCategoryState); // カテゴリーがFirestoreに追加された時に、booleanをフックに<MemoByCategory/>のfetchCategorys();でFirestoreから最新のカテゴリーデータを取ってくる
  const [categoryName, setCategoryName] = useRecoilState(categoryNameState); // TextFieldに入力されたデータを格納するステート
  const familyCardId = useRecoilValue(familyCardIdState);

  // NOTE: Firestoreにカテゴリーデータを保存する処理
  const addCategoryNameToFirebase = async () => {
    try {
      const memoCategoryRef = doc(
        collection(db, "setMemoUser", userId, "memo", familyCardId, "category")
      );
      await setDoc(memoCategoryRef, { categoryName: categoryName });
      setAddCategory(!addCategory);
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
          onChange={(e) => setCategoryName(e.target.value)}
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
