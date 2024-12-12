import React, { useEffect, useState } from "react";
// NOTE:firestoreのデータを取得するためのインポート
import { db } from "@/libs/firebase";
import { doc, updateDoc } from "firebase/firestore";
// NOTE:UIに関するインポート
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue } from "recoil";
import { memoCategorysState } from "@/app/states/memoCategorysState";
import { userIdState } from "@/app/states/userIdState";
import { changePreviewsState } from "@/app/states/changePreviewsState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type categorySelectType = {
  previewId: string;
};

// NOTE: スライダーの中のメモにカテゴリーを選択できる機能をつけるコンポーネント
const CategorySelect: React.FC<categorySelectType> = ({ previewId }) => {
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const [choiceCategoryInValue, setChoiceCategoryInValue] = useState(""); // セレクターで選択したカテゴリーを格納
  const categorys = useRecoilValue(memoCategorysState); // このステートを使い、Firestoreに登録されているカテゴリーをセレクターに表示
  const [changePreviews, setChangePreviews] =
    useRecoilState(changePreviewsState); // カテゴリーが選択されプレビューデータをFirestoreに登録したあとに、最新のプレビューデータをFirestoreから取得するためのステート
  const familyCardId = useRecoilValue(familyCardIdState);

  // NOTE:<MenuItem value={category.categoryName}>のvalueに設定した値を、Previewsのcategoryに登録するため、選択したカテゴリをchoiceCategoryInValueステートに格納
  const choiceCategory = (event: SelectChangeEvent) => {
    setChoiceCategoryInValue(event.target.value);
  };

  // NOTE: choiceCategoryInValueに値が入ったら、FirestoreのPreviewにもカテゴリーのデータを追加する
  const changeMemoCategoryToFirebase = async () => {
    if (choiceCategoryInValue) {
      try {
        const previewRef = doc(
          db,
          "setMemoUser",
          userId,
          "memo",
          familyCardId,
          "previews",
          previewId
        );
        await updateDoc(previewRef, { category: choiceCategoryInValue });
        setChangePreviews(!changePreviews);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    changeMemoCategoryToFirebase();
  }, [choiceCategoryInValue]);

  return (
    <FormControl
      sx={{
        width: "40px",
        height: "40px",
      }}
    >
      <Select
        value={choiceCategoryInValue || ""}
        renderValue={() => ""}
        sx={{
          backgroundColor: "rgba(255,255,255,0.7)",
          width: "100%",
          height: "100%",
        }}
        onChange={choiceCategory}
      >
        {categorys.map((category) => (
          <MenuItem key={category.id} value={category.categoryName}>
            {category.categoryName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
