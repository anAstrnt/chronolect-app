"use client";

import { Grid, IconButton, Input } from "@mui/material";
import React, { useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { memoState } from "@/app/states/memoState";
import { urlState } from "@/app/states/urlState";
import { previewState } from "@/app/states/previewState";
import { savePreviewsState } from "@/app/states/savedPreviewsState";
import { previewData } from "@/types/previewData";
import AddIcon from "@mui/icons-material/Add";
import { userIdState } from "@/app/states/userIdState";

const MemoAddForm = () => {
  const userId = useRecoilValue(userIdState);
  const [memo, setMemo] = useRecoilState(memoState); // NOTE:memoに入力された値を格納。
  const [url, setUrl] = useRecoilState(urlState);
  const [preview, setPreview] = useRecoilState(previewState);
  const [savedPreviews, setSavedPreviews] = useRecoilState(savePreviewsState);

  // クライアントからサーバーにリクエストを送信し、返ってきたレスポンスを状態として管理して、画面上に表示させるための処理
  const fetchPreview = async () => {
    try {
      // /api/previewのエンドポイントにエンコードしたURLを送信し、レスポンスを受け取る
      const res = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
      // レスポンスが正常（status:200）に返ってきたら走る処理
      if (res.ok) {
        // 返ってきたレスポンスをjson形式にパースし、型で明示的に定義する
        const data: previewData = await res.json();
        // プレビューの状態を保持を保持し、画面上に表示させるための処理の一部
        await setPreview({ ...data, memo, timeStamp: serverTimestamp() });
      }
    } catch (error) {
      console.error("プレビューの取得に失敗しました:", error);
    }
  };

  // previewのstateがセットされたタイミングで、firestoreにpreviewの情報を保存する
  useEffect(() => {
    if (preview) {
      const savePreview = async () => {
        try {
          // Firestore にプレビューデータを保存
          await addDoc(collection(db, "memo", userId, "previews"), preview);
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
