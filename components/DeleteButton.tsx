import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { workHistoryItemsTypes } from "@/types/workHistoryItemTypes";

type deleteButtonProps = {
  mainCollection: string;
  mainDocId: string;
  collection: string;
  docId: string;
  // item?: workHistoryItemsTypes;
};

const DeleteButton: React.FC<deleteButtonProps> = ({
  mainCollection,
  mainDocId,
  collection,
  docId,
  // item,
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
          // switch (docId) {
          //   case "workHistory":
          //     const workHistoryRef = doc(
          //       db,
          //       mainCollection,
          //       mainDocId,
          //       collection,
          //       docId
          //     );
          //     const objectToRemove = {
          //       company: item?.company || "",
          //       employmentDate: item?.employmentDate || "",
          //       resignationDate: item?.resignationDate || "",
          //     };
          //     console.log(workHistoryRef);
          //     console.log(objectToRemove);
          //     try {
          //       await updateDoc(workHistoryRef, {
          //         history:
          //           firebase.firestore.FieldValue.arrayRemove(objectToRemove), // 指定したオブジェクトを削除
          //       });
          //     } catch (err) {
          //       console.error("削除に失敗しました:", err);
          //     }
          //     break;
          // }
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
