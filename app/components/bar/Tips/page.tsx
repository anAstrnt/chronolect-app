import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { Grid, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type tipsCompProps = {
  title: string;
};

const page: React.FC<tipsCompProps> = ({ title }) => {
  const [open, setOpen] = React.useState(false);

  const changeOpenDaialog = () => {
    setOpen(!open);
  };

  const tipsDetail = () => {
    if (title === "Family Card") {
      return [
        "【Family Cardの作り方】",
        "① サイドバーのユーザーアイコンをクリックし、ユーザーごとにTodoを作成することができます",
        "②（ユーザーの登録していない場合は、サイドバーの＋ボタンからユーザーの登録をしてください。）",
        "③ 「Todo Title」に『やることリスト』や『ほしいものリスト』等、TodoのTitleを入力します",
        "④ Todo Titleを入力すると、入力欄横の＋ボタンからTodo Titleの保存ができます",
        "⑤ Todo Titleを保存すると、入力欄の下に表示されます",
        "【Todoの作り方】",
      ];
    }
    if (title === "Todo List") {
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
    if (title === "URL Memo List") {
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
    return ["ヒントがありません。"];
  };

  return (
    <React.Fragment>
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
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={changeOpenDaialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title + "に関するヒント"}</DialogTitle>
        <DialogContent>
          <Grid>
            {tipsDetail().map((tip, index) => (
              <Typography key={index}>{tip}</Typography>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={changeOpenDaialog}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default page;
