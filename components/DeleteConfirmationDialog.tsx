import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteButton from "@/components/DeleteButton";
import { IconButton } from "@mui/material";

type deleteConfirmationDialogProps = {
  topCollection: string;
  topDocId: string;
  mainCollection: string;
  mainDocId: string;
  collection: string;
  docId: string;
  collection2?: string;
  docId2?: string;
};

const DeleteConfirmationDialog: React.FC<deleteConfirmationDialogProps> = ({
  topCollection,
  topDocId,
  mainCollection,
  mainDocId,
  collection,
  docId,
  collection2,
  docId2,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <IconButton
        type="button"
        sx={{
          borderColor: "rgba(0,0,0,0.8)",
          "&:hover": {
            cursor: "pointer",
            background: "rgba(247,72,59,0.2)",
          },
        }}
        onClick={handleClickOpen}
      >
        <ClearIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"確認画面"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            FarmilyCardの削除ボタンが押されました。
            すべての情報を削除してよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>閉じる</Button>
          <DeleteButton
            topCollection={topCollection}
            topDocId={topDocId}
            mainCollection={mainCollection}
            mainDocId={mainDocId}
            collection={collection}
            docId={docId}
            appearance={"string"}
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteConfirmationDialog;
