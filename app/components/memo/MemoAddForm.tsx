"use client";

import React, { useEffect } from "react";
// NOTE:Firebaseのauth認証firestoreのデータを取得するためのインポート
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import db from "@/libs/firebase";
// NOTE:UIに関するインポート
import { Grid, IconButton, Input } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// NOTE:recoilと各種ステートのインポート
import { useRecoilState, useRecoilValue } from "recoil";
import { memoState } from "@/app/states/memoState";
import { urlState } from "@/app/states/urlState";
import { previewState } from "@/app/states/previewState";
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import { userIdState } from "@/app/states/userIdState";
import { familyCardIdState } from "@/app/states/familyCardIdState";
// NOTE:型のインポート
import { previewData } from "@/types/previewData";

// NOTE:Memoを追加するためのコンポーネント
const MemoAddForm = () => {
  const userId = useRecoilValue(userIdState); // ユーザーのuidを使用するためのステート
  const [memo, setMemo] = useRecoilState(memoState); // memoの入力データを格納するためのステート
  const [url, setUrl] = useRecoilState(urlState); // urlの入力データを格納するためのステート
  const [preview, setPreview] = useRecoilState(previewState); // api/previewから取ってきたURLのプレビューデータとメモ、タイムスタンプを格納する単発ステート。ついでに、Firestoreへの保存処理の発火装置。
  const [savedPreviews, setSavedPreviews] = useRecoilState(savePreviewsState); // Firestoreに保存した複数のpreviewを格納しているステート
  const familyCardId = useRecoilValue(familyCardIdState); // Sidebarで選択されたFamilyCardに紐づけたMemoを表示させるためのステート

  // NOTE: memoの追加ボタンで発動。クライアントからサーバーにリクエストを送信し、返ってきたレスポンスを状態として管理して、画面上に表示させるための処理
  const fetchPreview = async () => {
    try {
      // /api/previewのエンドポイントにエンコードしたURLを送信し、レスポンスを受け取る
      const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      // レスポンスが正常（status:200）に返ってきたら走る処理
      if (res.ok) {
        // 返ってきたレスポンスをjson形式にパースし、型で明示的に定義する
        const data: previewData = await res.json();
        // プレビューの状態を保持を保持し、画面上に表示させるための処理の一部
        await setPreview({
          ...data,
          memo,
          url: url,
          category: "カテゴリーなし",
          timeStamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("プレビューの取得に失敗しました:", error);
    }
  };

  // NOTE: previewのstateがセットされたタイミングで、firestoreにpreviewの情報を保存する
  useEffect(() => {
    if (preview) {
      const savePreview = async () => {
        try {
          // Firestore にプレビューデータを保存
          await addDoc(
            collection(
              db,
              "setMemoUser",
              userId,
              "memo",
              familyCardId,
              "previews"
            ),
            preview
          );
          // UIに表示させるpreviewを最新のものに更新する
          setSavedPreviews([...savedPreviews, preview]);
          setPreview(null); // 保存後にプレビューをクリア
          setMemo(""); // 入力欄をクリア
          setUrl(""); // 入力欄をクリア
        } catch (error) {
          console.error("Error saving preview:", error);
        }
      };
      savePreview();
    }
  }, [preview]);

  return (
    <Grid
      container
      sx={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <Input
        type="text"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="Enter a memo"
        sx={{ width: "200px", marginRight: "30px" }}
      />
      <Input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a URL"
        sx={{ width: "500px", marginRight: "30px" }}
      />
      <IconButton
        onClick={fetchPreview}
        disabled={!memo || !url}
        sx={{ backgroundColor: "rgba(255,255,255,0.7)" }}
      >
        <AddIcon />
      </IconButton>
    </Grid>
  );
};

export default MemoAddForm;
