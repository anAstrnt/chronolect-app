"use client";

import React, { useState } from "react";
import Button from "@mui/material/Button";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { headerTitleState } from "@/app/states/headerTitleState";

// NOTE: Headerに表示されるTipsのコンポーネント
// NOTE: それぞれのページの操作方法についての説明書き
const Page = () => {
  const [open, setOpen] = useState(false); //  ダイアログの開閉をするステート
  const headerTitle = useRecoilValue(headerTitleState);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  // NOTE: ダイアログの開閉処理
  const changeOpenDaialog = () => {
    setOpen(!open);
  };

  // NOTE: ダイアログに表示させる、それぞれのページの操作方法。
  const tipsDetail = () => {
    if (headerTitle === "Family Card") {
      return [
        "【Family Cardの作り方・削除の仕方】",
        "① サイドバーのユーザーアイコンをクリックし、ユーザーごとにプロフィールを作成することができます",
        "② 鉛筆アイコンを押すと入力欄がでてくるので、必要事項を入力し、Enterもしくは入力欄横の＋ボタンで保存をしてください。",
        "③ 保存した値は、鉛筆アイコンを押せば、また編集することもできます。",
        "④ 入力フォームの右横に✗ボタンがあるものは、任意の入力欄横の✗ボタンを押すと、その値を削除することができます。",
        "⑤ 画面右上の✗ボタンを押すとユーザーを削除することができます。",
      ];
    }
    if (headerTitle === "Todo List") {
      return [
        "【Todo Titleの作り方】",
        "① サイドバーのユーザーアイコンをクリックし、ユーザーごとにTodoを作成することができます",
        "②（ユーザーの登録していない場合は、サイドバーの＋ボタンからユーザーの登録をしてください。）",
        "③ 「Todo Title」に『やることリスト』や『ほしいものリスト』等、TodoのTitleを入力します",
        "④ Todo Titleを入力すると、入力欄横の＋ボタンからTodo Titleの保存ができます",
        "⑤ Todo Titleを保存すると、入力欄の下に表示されます",
        "【Todoの作り方】",
        "① Todo Titleのアイテム内の「Todo」入力欄にtodoを入力します",
        "② Todoを入力すると、入力欄横の＋ボタンからtodoの保存ができます",
        "③ Todoを保存すると、入力欄の下に表示されます",
        "【Todoの完了】",
        " Todo横の✓ボタンを押すと、完了したtodoに取り消し線を引くことができます",
        "【Todo TitleとTodoの削除】",
        "Todo Titleまたは、Todo横の✗ボタンを押すと対象のアイテムが削除されます",
      ];
    }
    if (headerTitle === "URL Memo List") {
      return [
        "【Memoの作り方】",
        "① サイドバーのユーザーアイコンをクリックし、ユーザーごとにMemoを作成することができます",
        "②（ユーザーの登録していない場合は、サイドバーの＋ボタンからユーザーの登録をしてください。）",
        "③ 一言メモを「Enter a Memo」に入力し、保存したいページのURLを「Enter a URL」に入力します",
        "④ メモとURLをどちらも入力すると、入力欄横の＋ボタンからMemoの保存ができます",
        "⑤ Memoを保存すると、PreviewAriaにMemoが表示されます",
        "【カテゴリーの作り方】",
        "① 「Add Category」にカテゴリー名を入力して、入力欄横の＋ボタンを押すと、カテゴリーを追加することができます",
        "② 作成したカテゴリーが画面下に表示されます",
        "③ 作成したMemoの左上のアイコンからカテゴリーを変更すると、選択したカテゴリーの表示欄にMemoが表示されます",
        "【Memoとカテゴリーの削除】",
        "Memoまたは、カテゴリーの右上の✗ボタンを押すと対象のアイテムが削除されます",
      ];
    }
    if (headerTitle === "Account") {
      return [
        "【概要】",
        "ユーザーの情報を変更削除できるページです。",
        "【メールアドレスの変更】",
        "① メールアドレスの変更をクリックします",
        "② 新しいメールアドレスとパスワードを入力し、「UPDATE EMAIL」をおします",
        "③ 新しいアドレスへメールが送られるので、内容を確認し認証を行ってください",
        "④ 認証するとメールアドレスの変更の手続きが完了します",
        "【パスワードの変更】",
        "① パスワードの変更をクリックします",
        "② 新しいパスワードと現在のパスワードを入力し、「UPDATE PASSWORD」をおします",
        "③ 「新しいパスワードに変更されました」のメッセージが表示されたら更新完了です",
        "【アカウントの削除】",
        "① アカウントの削除をクリックします",
        "② パスワードを入力し、「DELETE ACCOUNT」をおすとアカウントの削除が実行されます",
      ];
    }
    return ["ヒントがありません。"];
  };

  return (
    <Grid>
      {/* Headerに表示されるTipsボタン */}
      <Button
        variant="outlined"
        size="small"
        color="inherit"
        startIcon={<TipsAndUpdatesIcon />}
        onClick={changeOpenDaialog}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        Tips
      </Button>

      {/* Tipsボタンを押した時に表示されるダイアログ */}
      <Modal open={open} onClose={changeOpenDaialog}>
        <Box
          sx={{
            ...style,
            width: 700,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: "30px" }}>
              {headerTitle + "に関するヒント"}
            </Typography>
            <Grid sx={{ margin: "20px 0" }}>
              {tipsDetail().map((tip, index) => (
                <Typography key={index}>{tip}</Typography>
              ))}
            </Grid>
          </Box>
          <Button onClick={changeOpenDaialog}>閉じる</Button>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Page;
