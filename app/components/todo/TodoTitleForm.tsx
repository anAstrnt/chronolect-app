"use client";

import { TextField, IconButton, Grid, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { todoTitleState } from "@/app/states/todoTitleState";

const TodoTitleForm = () => {
  const [todoTitle, setTodoTitle] = useRecoilState(todoTitleState); // NOTE: todoTitleとしてインプット欄に入力された値を一時格納。

  // NOTE: インプット欄に入力されたTodoTitldを一時取得・表示させる処理。
  const onChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  // NOTE: 入力されたTodoTitleをFirebaseに送信する処理。
  const onSubmitTodoTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(db, "todoTitles"), {
      title: todoTitle,
      isDone: false,
      timestamp: serverTimestamp(),
    });
    setTodoTitle("");
  };

  return (
    <Grid>
      <Typography>Todo Title</Typography>
      <form onSubmit={onSubmitTodoTitle}>
        <TextField
          id="todo-title"
          label="Todo Title"
          variant="standard"
          value={todoTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeTodoTitle(e)
          }
        />
        <IconButton type="submit" disabled={!todoTitle ? true : false}>
          <AddIcon />
        </IconButton>
      </form>
    </Grid>
  );
};

export default TodoTitleForm;
