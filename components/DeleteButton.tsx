import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";
import "firebase/compat/firestore";

type deleteButtonProps = {
  mainCollection: string;
  mainDocId: string;
  collection: string;
  docId: string;
  collection2?: string;
  docId2?: string;
};

const DeleteButton: React.FC<deleteButtonProps> = ({
  mainCollection,
  mainDocId,
  collection,
  docId,
  collection2,
  docId2,
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
      if (mainCollection === "familyCard") {
        // コレクションの中のドキュメントを削除
        await deleteDoc(doc(db, mainCollection, mainDocId, collection, docId));
        setChangeQualifications(!changeQualifications);
      } else if (mainCollection === "todos") {
        // サブコレクションが存在するかどうかチェックして削除
        if (collection2 && docId2) {
          await deleteDoc(
            doc(
              db,
              mainCollection,
              mainDocId,
              collection,
              docId,
              collection2,
              docId2
            )
          );
        } else {
          await deleteDoc(
            doc(db, mainCollection, mainDocId, collection, docId)
          );
        }
      }

      // switch (mainCollection) {
      //   case "familyCard":
      //     await deleteDoc(
      //       doc(db, mainCollection, mainDocId, collection, docId)
      //     );
      //     setChangeQualifications(!changeQualifications);
      //     break;

      //   case "todos":
      //     switch (collection2) {
      //       case "":
      //         await deleteDoc(
      //           doc(db, mainCollection, mainDocId, collection, docId)
      //         );
      //         break;
      //       case "todo":
      //         await deleteDoc(
      //           doc(
      //             db,
      //             mainCollection,
      //             mainDocId,
      //             collection,
      //             docId,
      //             collection2,
      //             docId2
      //           )
      //         );
      //         break;
      //     }
      //     break;
      // }
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
