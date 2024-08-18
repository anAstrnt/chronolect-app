"use client";

import { TextField, IconButton, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { todoTitleState } from "@/app/states/todoTitleState";

const TodoTitleForm = () => {
  const [todoTitle, setTodoTitle] = useRecoilState(todoTitleState);

  const onChangeTodoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

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
        <IconButton type="submit">
          <AddIcon />
        </IconButton>
      </form>
    </Grid>
  );
};

export default TodoTitleForm;
