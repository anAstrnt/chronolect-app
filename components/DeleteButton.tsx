import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";

type deleteButtonProps = {
  mainCollection: string;
  mainDocId: string;
  collection: string;
  docId: string;
};

const DeleteButton: React.FC<deleteButtonProps> = ({
  mainCollection,
  mainDocId,
  collection,
  docId,
}) => {
  const [changeQualifications, setChangeQualifications] = useRecoilState(
    changeQualificationsState
  );

  const delelteAction = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mainDocId: string,
    docId: string
  ) => {
    try {
      switch (mainCollection) {
        case "familyCard":
          await deleteDoc(
            doc(db, mainCollection, mainDocId, collection, docId)
          );
          setChangeQualifications(!changeQualifications);
          break;
        case "todoTitles":
          switch (collection) {
            case "":
              await deleteDoc(doc(db, mainCollection, mainDocId));
              break;
            case "todo":
              await deleteDoc(
                doc(db, mainCollection, mainDocId, collection, docId)
              );
              break;
          }
          break;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <IconButton
      type="button"
      sx={{
        borderColor: "rgba(0,0,0,0.8)",
        "&:hover": {
          cursor: "pointer",
          background: "rgba(247,72,59,0.2)",
        },
      }}
      onClick={(e) => delelteAction(e, mainDocId, docId)}
    >
      <ClearIcon />
    </IconButton>
  );
};

export default DeleteButton;
