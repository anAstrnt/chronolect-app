"use client";

import { todoTitleState } from "@/app/states/todoTitleState";
import InputButton from "@/components/InputButton";
import { db } from "@/libs/firebase";
import { todos } from "@/types/todos";
import { todoTytles } from "@/types/todoTytles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { timeStamp } from "console";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export const TodoTitleCard = () => {
  const todoTitle = useRecoilValue(todoTitleState);
  const [todoTitles, setTodoTitles] = useState<todoTytles[]>([]);
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<todos[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todoTitles"), (snapshot) => {
      const newTitles = snapshot.docs.map((doc) => ({
        todoTitleId: doc.id,
        todoTitle: doc.data().title,
        timestamp: doc.data().timestamp,
      }));
      setTodoTitles(newTitles);
    });
    return () => unsubscribe();
  }, [todoTitle]);

  // TODO : todoをFirestoreにいれるとことまで実装。まだテストしていないので、テストしてうまくいっていたら、次はTodoを取得して表示させていく。
  const onSubmitTodos = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todoTitles) {
      await addDoc(collection(db, "todoTitles", todoTitles[0].todoTitleId), {
        todo: todo,
        isDone: false,
        timeStamp: serverTimestamp(),
      });
    }
  };

  const onChangeTodos = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTodo(e.target.value);
  };

  return (
    <Grid>
      <Typography>Todos</Typography>
      {todoTitles.map((title) => (
        <Card sx={{ maxWidth: 300 }} key={title.todoTitleId}>
          <CardContent>
            <Typography variant="h5" component="div">
              {title.todoTitle}
            </Typography>
            <form onSubmit={onSubmitTodos}>
              <TextField
                id="todo"
                label="Todo"
                variant="standard"
                value={todoTitle}
                onChange={(e) => onChangeTodos(e)}
              />
              <InputButton />
            </form>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              adj
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
  );
};
