import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState } from "recoil";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";
import { collection as collectionRef } from "firebase/firestore";
import "firebase/compat/firestore";
import { addCategoryState } from "@/app/states/addCategoryState";
import { changePreviewsState } from "@/app/states/changePreviewsState";

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
  const [addCategory, setAddCategory] = useRecoilState(addCategoryState);
  const [changePreviews, setChangePreviews] =
    useRecoilState(changePreviewsState);

  const delelteAction = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    mainDocId: string,
    docId: string
  ) => {
    try {
      // TODO：familyCardのdeleteを調整する
      if (mainCollection === "familyCard") {
        await deleteDoc(doc(db, mainCollection, mainDocId, collection, docId));
        setChangeQualifications(!changeQualifications);
      }

      // NOTE：todosのTitleの削除処理
      if (mainCollection === "todos" && !collection2) {
        // titleのDeleteButtonが押された時、`title`配下の`todo`をすべて取得
        // todoに何かしら入っている状態でTitleを削除する際には、配下のtodoもすべて同時に削除する必要がある
        const todoCollectionRef = collectionRef(
          db,
          mainCollection,
          mainDocId,
          collection,
          docId,
          "todo"
        );
        const todosSnapshot = await getDocs(todoCollectionRef);
        const deleteTodoPromises = todosSnapshot.docs.map(
          (todoDoc) => deleteDoc(todoDoc.ref) // todoDoc.ref=todoDocのドキュメント参照。ドキュメントの削除や更新ができる。
        );
        // `todo`の削除が完了するまで待機
        await Promise.all(deleteTodoPromises); // 非同期処理（Promise）を並行して実行し、そのすべてが完了するまで待つ
        // すべてのサブコレクションを削除した後に`title`を削除
        await deleteDoc(doc(db, mainCollection, mainDocId, collection, docId));
        setChangePreviews(!changePreviews);
        // NOTE：todoの削除処理
      } else if (collection2 && docId2) {
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
      }

      // NOTE：memoコンポーネントのcategory の削除処理
      if (mainCollection === "memo") {
        if (collection === "category") {
          await deleteDoc(
            doc(db, mainCollection, mainDocId, collection, docId)
          );
          setAddCategory(!addCategory);
        }
        if (collection === "previews") {
          console.log("in preview");
          await deleteDoc(
            doc(db, mainCollection, mainDocId, collection, docId)
          );
        }
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
