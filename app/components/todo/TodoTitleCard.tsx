"use client";

import { todoTitleState } from "@/app/states/todoTitleState";
import DoneButton from "@/components/DoneButton";
import AddIcon from "@mui/icons-material/Add";
import { db } from "@/libs/firebase";
import { todos as TodosType } from "@/types/todos";
import { todoTytles } from "@/types/todoTytles";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

type todoType = {
  [key: string]: string;
};

export const TodoTitleCard = () => {
  const todoTitle = useRecoilValue(todoTitleState); // NOTE:todoTitleに入力された値を格納。cardに表示するTitleを取ってくるタイミングを操作するために使用。
  const [todoTitles, setTodoTitles] = useState<todoTytles[]>([]); // NOTE: firebaseから取得したTodoTitleを格納。表示まわりやtodoの取得で使用。
  const [todo, setTodo] = useState<todoType>({}); // NOTE: todoとしてインプット欄に入力された値を一時格納。
  const [todosMap, setTodosMap] = useState<Map<string, TodosType[]>>(new Map()); // NOTE: firebaseからTodoを取得し、対応するtodoTitleIdに紐づけMapオブジェクトとして格納。TodoTitleIdに対応したTodoをJSXで表示するのに使用。

  // NOTE: 入力されたTodoをFirebaseに送信する処理。
  const onSubmitTodos = async (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    e.preventDefault();
    // NOTE: 入力されたTodoがどのTodoTitleのものかをindexで判別し、対応するtodoTitleIdを取得。
    const todoTitleId = todoTitles[index]?.todoTitleId;
    if (todoTitleId) {
      // NOTE: 取得したtodoTitleIdに紐づけて、Firebaseにtodoをサブコレクションとして送信する処理。
      await addDoc(collection(db, "todoTitles", todoTitleId, "todo"), {
        todo: todo[todoTitleId],
        isDone: false,
        timeStamp: serverTimestamp(),
      });
    }
    setTodo({ ...todo, [todoTitleId]: "" });
  };

  // NOTE: cardにtodoTitleを表示するため、Firebaseから取得する処理。
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

  // NOTE: インプット欄に入力されたTodoを一時取得・表示させる処理。
  const onChangeTodos = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    todoTitleId: string
  ) => {
    setTodo({ ...todo, [todoTitleId]: e.target.value });
  };

  // NOTE: todoをFirebaseから取得し、JSXで表示させるための処理。Firebaseから何かしらtodoTitleが取得されれば処理が走る。
  useEffect(() => {
    if (todoTitles.length > 0) {
      // NOTE: todoTitleを個別のTitleにし、title.todoTitleIdに対応するtodoを取得。
      todoTitles.forEach((title) => {
        const unsubscribe = onSnapshot(
          collection(db, "todoTitles", title.todoTitleId, "todo"),
          (snapshot) => {
            const newTodos = snapshot.docs.map((doc) => ({
              todoTitleId: title.todoTitleId,
              todoId: doc.id,
              todo: doc.data().todo,
              timeStamp: doc.data().timeStamp,
            }));
            // NOTE: 取得したtodoは対応するTodoTitleの中で表示させたいので、TodoTitleIdに紐づけMapオブジェクトで管理する。
            setTodosMap((prevMap) =>
              new Map(prevMap).set(title.todoTitleId, newTodos)
            );
          }
        );
        return () => unsubscribe();
      });
    }
  }, [todoTitles]);

  // NOTE: 選択したTodoTitleを削除する処理
  const deleteTitle = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    try {
      await deleteDoc(doc(db, "todoTitles", todoTitles[index].todoTitleId));
    } catch (err) {
      console.error(err);
    }
  };

  // NOTE: 選択したtodoを削除する処理
  const deleteTodo = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    todoTitleId: string,
    todoId: string
  ) => {
    try {
      if (todoTitleId) {
        await deleteDoc(doc(db, "todoTitles", todoTitleId, "todo", todoId));
        console.log("delet comp");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TODO: clearの実装
  return (
    <Grid>
      <Typography>Todos</Typography>
      <Grid sx={{ display: "flex" }}>
        {todoTitles.map((title, index) => (
          <Card sx={{ maxWidth: 300, margin: "10px" }} key={title.todoTitleId}>
            <CardContent>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" component="div">
                  {title.todoTitle}
                </Typography>
                <IconButton
                  type="button"
                  sx={{
                    borderColor: "rgba(0,0,0,0.8)",
                    "&:hover": {
                      cursor: "pointer",
                      background: "rgba(247,72,59,0.2)",
                    },
                  }}
                  onClick={(e) => deleteTitle(e, index)}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
              <form onSubmit={(e) => onSubmitTodos(e, index)}>
                <TextField
                  id="todo"
                  label="Todo"
                  variant="standard"
                  value={todo[title.todoTitleId] || ""}
                  onChange={(e) => onChangeTodos(e, title.todoTitleId)}
                />
                <IconButton type="submit" disabled={!todo}>
                  <AddIcon />
                </IconButton>
              </form>
              {todosMap.get(title.todoTitleId)?.map((todo) => (
                <Grid
                  sx={{ display: "flex", alignItems: "center" }}
                  key={todo.todoId}
                >
                  <Typography>{todo.todo}</Typography>
                  <DoneButton />
                  <IconButton
                    type="button"
                    sx={{
                      borderColor: "rgba(0,0,0,0.8)",
                      "&:hover": {
                        cursor: "pointer",
                        background: "rgba(247,72,59,0.2)",
                      },
                    }}
                    onClick={(e) =>
                      deleteTodo(e, title.todoTitleId, todo.todoId)
                    }
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
              ))}
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};
