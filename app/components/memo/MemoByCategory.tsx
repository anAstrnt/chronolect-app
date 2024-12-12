import React, { useEffect } from "react";
// NOTE:firestoreのデータを取得するためのインポート
import { db } from "@/libs/firebase";
import { collection, getDocs } from "firebase/firestore";
// NOTE:UIに関するインポート
import { Grid, Typography } from "@mui/material";
// NOTE:コンポーネントのインポート
import MemoSlider from "./MemoSlider";
import DeleteButton from "@/components/DeleteButton";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { addCategoryState } from "@/app/states/addCategoryState";
import { memoCategorysState } from "@/app/states/memoCategorysState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

// NOTE:カテゴリー分けされたプレビューデータを表示させるコンポーネント
const MemoByCategory = () => {
  const [categorys, setCategorys] = useRecoilState(memoCategorysState); // Firestoreから取得したカテゴリー情報を格納し、画面上に表示させるためのステート
  const addCategory = useRecoilValue(addCategoryState); // <CategoryAddForm/>でカテゴリーが追加されたらFirestoreからの取得処理が走るようにするためのステート
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたMemoを表示させるためのステート

  // NOTE: Firestoreからcategoryデータを取ってくる処理
  const fetchCategorys = async () => {
    try {
      const memoCategoryRef = collection(
        db,
        "setMemoUser",
        userId,
        "memo",
        familyCardId,
        "category"
      );
      const fetchCategorysDate = await getDocs(memoCategoryRef);
      setCategorys(
        fetchCategorysDate.docs.map((doc) => ({
          id: doc.id,
          categoryName: doc.data().categoryName,
        }))
      );
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    fetchCategorys();
  }, [userId, familyCardId, addCategory]);

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      {categorys.map((category) => (
        <Grid
          key={category.id}
          item
          sx={{
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: "30px",
            minHeight: "300px",
            width: "100%",
            height: "400px",
            margin: "10px 0",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            sx={{ textAlign: "center", margin: "15px 0" }}
          >
            {category.categoryName}
          </Typography>
          <Grid item sx={{ position: "absolute", top: "10px", right: "10px" }}>
            <DeleteButton
              topCollection="setMemoUser"
              topDocId={userId}
              mainCollection="memo"
              mainDocId={familyCardId}
              collection="category"
              docId={category.id}
            />
          </Grid>
          {/* プレビューデータの本体 */}
          <Grid item sx={{ margin: "0px 30px" }}>
            <MemoSlider selectCategory={category.categoryName} />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default MemoByCategory;
