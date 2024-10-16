"use client";

import { todoTitleState } from "@/app/states/todoTitleState";
import AddIcon from "@mui/icons-material/Add";
import { db } from "@/libs/firebase";
import { todos as TodosType } from "@/types/todos";
import { todoTytles } from "@/types/todoTytles";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteButton from "@/components/DeleteButton";
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
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import DoneIcon from "@mui/icons-material/Done";

type todoType = {
  [key: string]: string;
};

export const TodoTitleCard = () => {
  const title = useRecoilValue(todoTitleState); // NOTE:todoTitleに入力された値を格納。cardに表示するTitleを取ってくるタイミングを操作するために使用。
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
    const titleId = todoTitles[index]?.titleId;
    if (titleId) {
      // NOTE: 取得したtodoTitleIdに紐づけて、Firebaseにtodoをサブコレクションとして送信する処理。
      await addDoc(collection(db, "todoTitles", titleId, "todo"), {
        todo: todo[titleId],
        isDone: false,
        timeStamp: serverTimestamp(),
      });
    }
    setTodo({ ...todo, [titleId]: "" });
  };

  // NOTE: cardにtodoTitleを表示するため、Firebaseから取得する処理。
  useEffect(() => {
    // NOTE: sort（クライアント側）でtimeStampの並び替えを行うと、並び替えに若干のタイムラグが生じたのでorderBy（サーバー側）で並び替えをしています
    const q = query(collection(db, "todoTitles"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTitles = snapshot.docs.map((doc) => ({
        titleId: doc.id,
        title: doc.data().title,
        isDone: doc.data().isDone,
        timestamp: doc.data().timestamp,
      }));
      setTodoTitles(newTitles);
    });
    return () => unsubscribe();
  }, [title]);

  // NOTE: インプット欄に入力されたTodoを一時取得・表示させる処理。
  const onChangeTodos = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    titleId: string
  ) => {
    setTodo({ ...todo, [titleId]: e.target.value });
  };

  // NOTE: todoをFirebaseから取得し、JSXで表示させるための処理。Firebaseから何かしらtodoTitleが取得されれば処理が走る。
  useEffect(() => {
    if (todoTitles.length > 0) {
      // NOTE: todoTitleを個別のTitleにし、title.todoTitleIdに対応するtodoを取得。
      todoTitles.forEach((title) => {
        // NOTE: sort（クライアント側）でtimeStampの並び替えを行うと、並び替えに若干のタイムラグが生じたのでorderBy（サーバー側）で並び替えをしています
        const q = query(
          collection(db, "todoTitles", title.titleId, "todo"),
          orderBy("timeStamp")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newTodos = snapshot.docs.map((doc) => ({
            titleId: title.titleId,
            todoId: doc.id,
            todo: doc.data().todo,
            isDone: doc.data().isDone,
            timeStamp: doc.data().timeStamp,
          }));
          // NOTE: 取得したtodoは対応するTodoTitleの中で表示させたいので、TodoTitleIdに紐づけMapオブジェクトで管理する。
          setTodosMap((prevMap) =>
            new Map(prevMap).set(title.titleId, newTodos)
          );
        });
        return () => unsubscribe();
      });
    }
  }, [todoTitles]);

  // NOTE: 完了したTODOに取り消し線をつける処理
  const onChangeDoneTodo = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    titleId: string,
    todoId: string,
    isDone: boolean
  ) => {
    try {
      const todoDocRef = await doc(db, "todoTitles", titleId, "todo", todoId);
      updateDoc(todoDocRef, {
        isDone: !isDone,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Grid>
      <Typography>Todos</Typography>
      <Grid sx={{ display: "flex" }}>
        {todoTitles.map((title, index) => (
          <Card sx={{ maxWidth: 300, margin: "10px" }} key={title.titleId}>
            <CardContent>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" component="div">
                  {title.title}
                </Typography>
                <DeleteButton
                  mainCollection={"todoTitles"}
                  mainDocId={title.titleId}
                  collection={""}
                  docId={""}
                />
              </Grid>
              <form onSubmit={(e) => onSubmitTodos(e, index)}>
                <TextField
                  id="todo"
                  label="Todo"
                  variant="standard"
                  value={todo[title.titleId] || ""}
                  onChange={(e) => onChangeTodos(e, title.titleId)}
                />
                <IconButton type="submit" disabled={!todo[title.titleId]}>
                  <AddIcon />
                </IconButton>
              </form>
              {todosMap.get(title.titleId)?.map((todo) => (
                <Grid
                  sx={{ display: "flex", alignItems: "center" }}
                  key={todo.todoId}
                >
                  <Typography
                    sx={{
                      textDecoration: todo.isDone ? "line-through" : "none",
                      color: todo.isDone ? "text.disabled" : "text.primary",
                    }}
                  >
                    {todo.todo}
                  </Typography>
                  <IconButton
                    type="button"
                    sx={{
                      borderColor: "rgba(0,0,0,0.8)",
                      "&:hover": {
                        cursor: "pointer",
                        background: "rgba(61,196,59,0.2)",
                      },
                    }}
                    onClick={(e) =>
                      onChangeDoneTodo(
                        e,
                        title.titleId,
                        todo.todoId,
                        todo.isDone
                      )
                    }
                  >
                    <DoneIcon />
                  </IconButton>
                  <DeleteButton
                    mainCollection={"todoTitles"}
                    mainDocId={title.titleId}
                    collection={"todo"}
                    docId={todo.todoId}
                  />
                </Grid>
              ))}
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};
