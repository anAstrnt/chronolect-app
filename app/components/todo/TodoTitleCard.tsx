"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/libs/firebase";
import { useRecoilValue } from "recoil";
import DeleteButton from "@/components/DeleteButton";
// NOTE:UIに関するインポート
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoneIcon from "@mui/icons-material/Done";
import AddIcon from "@mui/icons-material/Add";
// NOTE:Firebaseに関するインポート
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
// NOTE:型に関するインポート
import { todos as TodosType } from "@/types/todos";
import { todoTytles } from "@/types/todoTytles";
// NOTE:ステートに関するインポート
import { todoTitleState } from "@/app/states/todoTitleState";
import { userIdState } from "@/app/states/userIdState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type todoType = {
  [key: string]: string;
};

// NOTE: TodoTitleFormコンポーネントでTodoTitleを入力したらタイトルが表示されたカードが生成されTodoを入力できるようになる。このカードを管理するためのコンポーネント。
export const TodoTitleCard = () => {
  const userId = useRecoilValue(userIdState); // NOTE:authのuidを格納。FirestoreのDocIdとして使用。
  const todoTitle = useRecoilValue(todoTitleState); // NOTE:todoTitleに入力された値を格納。cardに表示するTitleを取ってくるタイミングを操作するために使用。
  const [todoTitles, setTodoTitles] = useState<todoTytles[]>([]); // NOTE: firebaseから取得したTodoTitleを格納。表示まわりやtodoの取得で使用。
  const [todo, setTodo] = useState<todoType>({}); // NOTE: todoとしてインプット欄に入力された値を一時格納。
  const [todosMap, setTodosMap] = useState<Map<string, TodosType[]>>(new Map()); // NOTE: firebaseからTodoを取得し、対応するtodoTitleIdに紐づけMapオブジェクトとして格納。TodoTitleIdに対応したTodoをJSXで表示するのに使用。
  const familyCardId = useRecoilValue(familyCardIdState); // NOTE: FirestoreのサブDocId。FamilyCard毎にTodoを紐づけている。
  const [showTodos, setShowTodos] = useState<boolean[]>(
    new Array(todoTitles.length).fill(true)
  ); // NOTE:Todoの表示非表示を切り替えるステート。初期値：Titleの数分ある値のすべてをtrueとする。

  // NOTE: インプット欄に入力されたTodoを一時取得・表示させる処理。
  const onChangeTodos = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    titleId: string
  ) => {
    setTodo({ ...todo, [titleId]: e.target.value });
  };

  // NOTE: cardにtodoTitleを表示するため、Firebaseから取得する処理。
  useEffect(() => {
    //  sort（クライアント側）でtimeStampの並び替えを行うと、並び替えに若干のタイムラグが生じたのでorderBy（サーバー側）で並び替えをしています
    const q = query(
      collection(db, "setTodoUser", userId, "todos", familyCardId, "title"),
      orderBy("timestamp")
    );
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
  }, [todoTitle, userId, familyCardId]);

  // NOTE: todoをFirebaseから取得し、JSXで表示させるための処理。Firebaseから何かしらtodoTitleが取得されれば処理が走る。
  useEffect(() => {
    if (todoTitles.length > 0) {
      // todoTitlesを個別のTitleにし、todoTitle.todoTitleIdに対応するtodoを取得。
      todoTitles.forEach((title) => {
        // sort（クライアント側）でtimeStampの並び替えを行うと、並び替えに若干のタイムラグが生じたのでorderBy（サーバー側）で並び替えをしています
        const q = query(
          collection(
            db,
            "setTodoUser",
            userId,
            "todos",
            familyCardId,
            "title",
            title.titleId,
            "todo"
          ),
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
          // newTodos: const titleId = [{doc},{doc}・・・];
          // 取得したtodoは対応するTodoTitleの中で表示させたいので、TodoTitleIdに紐づけMapオブジェクトで管理する。
          setTodosMap(
            (prevMap) => new Map(prevMap).set(title.titleId, newTodos) // Map.set('key', 'value(todosオブジェクトの配列)');
          );
        });
        return () => unsubscribe();
      });
    }
  }, [todoTitles]);

  // NOTE: 入力されたTodoをFirebaseに送信する処理。
  const onSubmitTodos = async (
    e: React.FormEvent<HTMLFormElement>,
    index: number
  ) => {
    e.preventDefault();
    //  入力されたTodoがどのTodoTitleのものかをindexで判別し、対応するtodoTitleIdを取得。
    const titleId = todoTitles[index]?.titleId;
    if (titleId) {
      //  取得したtodoTitleIdに紐づけて、Firebaseにtodoをサブコレクションとして送信する処理。
      await addDoc(
        collection(
          db,
          "setTodoUser",
          userId,
          "todos",
          familyCardId,
          "title",
          titleId,
          "todo"
        ),
        {
          todo: todo[titleId],
          isDone: false,
          timeStamp: serverTimestamp(),
        }
      );
    }
    setTodo({ ...todo, [titleId]: "" });
  };

  // NOTE: 完了したTODOに取り消し線をつける処理
  const onChangeDoneTodo = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    titleId: string,
    todoId: string,
    isDone: boolean
  ) => {
    try {
      const todoDocRef = await doc(
        db,
        "setTodoUser",
        userId,
        "todos",
        familyCardId,
        "title",
        titleId,
        "todo",
        todoId
      );
      updateDoc(todoDocRef, {
        isDone: !isDone,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onClickShowTodosChange = (index: number) => {
    setShowTodos((prev) => {
      const newShowTodos = [...prev];
      newShowTodos[index] = !newShowTodos[index];
      return newShowTodos;
    });
  };

  return (
    <Grid
      sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}
    >
      {todoTitles.map((title, index) => (
        <Grid
          item
          key={title.titleId}
          sx={{
            flex: "0 1 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card
            sx={{
              minWidth: 300,
              maxWidth: 500,
              margin: "10px",
            }}
          >
            <CardContent sx={{ position: "relative" }}>
              <Grid container alignItems="center" justifyContent="center">
                <Grid
                  container
                  item
                  width="auto"
                  sx={{ margin: "10px 30px 10px 10px" }}
                >
                  <Typography variant="h5" component="div">
                    {title.title}
                  </Typography>
                  <Grid
                    item
                    sx={{
                      margin: "0 5px",
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                  >
                    <DeleteButton
                      topCollection="setTodoUser"
                      topDocId={userId}
                      mainCollection={"todos"}
                      mainDocId={familyCardId}
                      collection={"title"}
                      docId={title.titleId}
                      appearance={"icon"}
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  justifyContent="flex-end"
                  alignItems="center"
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <Grid item>
                    <Typography sx={{ color: "gray" }}>
                      {todosMap.get(title.titleId)?.length}
                    </Typography>
                  </Grid>
                  <IconButton onClick={() => onClickShowTodosChange(index)}>
                    {showTodos[index] ? (
                      <KeyboardArrowUpIcon sx={{ fontSize: "medium" }} />
                    ) : (
                      <KeyboardArrowDownIcon sx={{ fontSize: "medium" }} />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <form
                onSubmit={(e) => onSubmitTodos(e, index)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "30px 0",
                }}
              >
                <TextField
                  id="todo"
                  label="Todo"
                  variant="standard"
                  value={todo[title.titleId] || ""}
                  onChange={(e) => onChangeTodos(e, title.titleId)}
                  fullWidth
                />
                <IconButton
                  type="submit"
                  disabled={!todo[title.titleId]}
                  sx={{
                    width: "30px",
                    height: "30px",
                    backgroundColor: "rgba(0,0,0,0.1)",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </form>
              {showTodos[index] &&
                todosMap.get(title.titleId)?.map((todo) => (
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
                      topCollection="setTodoUser"
                      topDocId={userId}
                      mainCollection={"todos"}
                      mainDocId={familyCardId}
                      collection={"title"}
                      docId={title.titleId}
                      collection2={"todo"}
                      docId2={todo.todoId}
                      appearance={"icon"}
                    />
                  </Grid>
                ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
