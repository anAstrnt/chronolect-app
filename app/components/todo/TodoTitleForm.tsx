"use client";

import React from "react";
import { db } from "@/libs/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
// NOTE:UIに関するインポート
import { TextField, IconButton, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// NOTE:Firebaseに関するインポート
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// NOTE:ステートに関するインポート
import { todoTitleState } from "@/app/states/todoTitleState";
import { userIdState } from "@/app/states/userIdState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

// NOTE: TodoTitleを入力・保存するためのコンポーネント
const TodoTitleForm = () => {
  const [todoTitle, setTodoTitle] = useRecoilState(todoTitleState); // NOTE: todoTitleとしてインプット欄に入力された値を一時格納。
  const userId = useRecoilValue(userIdState); // NOTE:authのuidを格納。FirestoreのDocIdとして使用。
  const familyCardId = useRecoilValue(familyCardIdState); // NOTE: FirestoreのサブDocId。FamilyCard毎にTodoを紐づけている。

  // NOTE: インプット欄に入力されたTodoTitldを一時取得・表示させる処理。
  const onChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  // NOTE: 入力されたTodoTitleをFirebaseに送信する処理。
  const onSubmitTodoTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // formのデフォルトの動作を遮断
    await addDoc(
      collection(db, "setTodoUser", userId, "todos", familyCardId, "title"),
      {
        title: todoTitle,
        isDone: false,
        timestamp: serverTimestamp(),
      }
    );
    setTodoTitle("");
  };

  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={onSubmitTodoTitle}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="todo-title"
          label="Todo Title"
          variant="standard"
          value={todoTitle}
          sx={{ width: "500px" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeTodoTitle(e)
          }
        />
        <IconButton
          type="submit"
          disabled={!todoTitle ? true : false}
          sx={{ backgroundColor: "rgba(255,255,255,0.7)", marginLeft: "30px" }}
        >
          <AddIcon />
        </IconButton>
      </form>
    </Grid>
  );
};

export default TodoTitleForm;
