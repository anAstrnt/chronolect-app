"use client";

import React, { useEffect, useState } from "react";
// NOTE:firestoreのデータを取得するためのインポート
import { db } from "@/libs/firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import { deleteCategoryState } from "@/app/states/deleteCategoryState";
import { changePreviewsState } from "@/app/states/changePreviewsState";

// NOTE:カテゴリー分けされたプレビューデータを表示させるコンポーネント
const MemoByCategory = () => {
  const [categorys, setCategorys] = useRecoilState(memoCategorysState); // Firestoreから取得したカテゴリー情報を格納し、画面上に表示させるためのステート
  const [addCategory, setAddCategory] = useRecoilState(addCategoryState); // <CategoryAddForm/>でカテゴリーが追加されたらFirestoreからの取得処理が走るようにするためのステート
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたMemoを表示させるためのステート
  const savedPreviews = useRecoilValue(savePreviewsState); // Firestoreに保存した複数のpreviewを格納しているステート
  const [fetchCategory, setFetchCategory] = useState(false); // カテゴリーなしを１回だけFirestoreに登録するよう制御するステート
  const [deleteCategory, setDeleteCategory] =
    useRecoilState(deleteCategoryState);
  const [changePreviews, setChangePreviews] =
    useRecoilState(changePreviewsState);

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
      if (savedPreviews) {
        setFetchCategory(true);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    fetchCategorys();
  }, [userId, familyCardId, addCategory, savedPreviews, deleteCategory]);

  // NOTE:ユーザーアイコンが押されたら↑のfetchCategorys関数が作動し、カテゴリーをFirestoreから取得してくるが、カテゴリーが何も登録されていない状態だったら「カテゴリーなし」をカテゴリーに追加する処理
  const addFirstCategory = async () => {
    try {
      const memoCategoryRef = doc(
        collection(db, "setMemoUser", userId, "memo", familyCardId, "category")
      );
      await setDoc(memoCategoryRef, { categoryName: "カテゴリーなし" });
      setAddCategory(!addCategory); // <MemoByCategory/>のfetchCategorys();でFirestoreから最新のカテゴリーデータを取ってくる
      setFetchCategory(false); // カテゴリーなしが複数作成されるのを防ぐステート
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    if (categorys.length === 0 && fetchCategory) {
      addFirstCategory();
    }
  }, [fetchCategory]);

  // NOTE:カテゴリーの削除がされた際にfetchCategorys関数の処理完了後に発火する処理。削除したカテゴリー上にMemoがあった場合は、カテゴリーなしに再振り分けを行う
  const afterDeleteCategory = async () => {
    try {
      // 削除されたカテゴリーがない場合、メモを「カテゴリーなし」に移動
      const updatedPreviews = savedPreviews.map((preview) => {
        const categoryExists = categorys.some((category) => {
          return category.categoryName === preview.category;
        });
        // カテゴリーが存在しなければ "カテゴリーなし" に変更
        if (!categoryExists) {
          return {
            ...preview,
            category: "カテゴリーなし",
          };
        }
        return preview;
      });
      // Firestore にアップデート
      const updatePromises = updatedPreviews.map(async (preview) => {
        if (preview.previewTitleId) {
          const previewRef = doc(
            db,
            "setMemoUser",
            userId,
            "memo",
            familyCardId,
            "previews",
            preview.previewTitleId
          );
          await updateDoc(previewRef, { category: preview.category });
        }
      });
      // Firestore のすべての更新処理が完了するまで待機
      await Promise.all(updatePromises);
      // 最新のプレビュー情報を取得してUIを更新
      setChangePreviews(!changePreviews);
      setDeleteCategory(false);
    } catch (error) {
      console.error("Error in afterDeleteCategory:", error);
    }
  };
  useEffect(() => {
    if (deleteCategory) {
      afterDeleteCategory();
    }
  }, [categorys]);

  return (
    <Grid container sx={{ width: "100%", height: "100%" }}>
      {categorys
        .filter((prev) =>
          prev.categoryName === "カテゴリーなし" ? !categorys : categorys
        )
        .map((category) => (
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
            <Grid
              item
              sx={{ position: "absolute", top: "10px", right: "10px" }}
            >
              <DeleteButton
                topCollection="setMemoUser"
                topDocId={userId}
                mainCollection="memo"
                mainDocId={familyCardId}
                collection="category"
                docId={category.id}
                appearance={"icon"}
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
