import { Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState, useSetRecoilState } from "recoil";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";
import { collection as collectionRef } from "firebase/firestore";
import "firebase/compat/firestore";
import { changePreviewsState } from "@/app/states/changePreviewsState";
import { fetchWorkHistoryState } from "@/app/states/fetchWorkHistoryState";
import { deleteCategoryState } from "@/app/states/deleteCategoryState";

type deleteButtonProps = {
  topCollection: string;
  topDocId: string;
  mainCollection: string;
  mainDocId: string;
  collection: string;
  docId: string;
  collection2?: string;
  docId2?: string;
  appearance?: string;
};

const DeleteButton: React.FC<deleteButtonProps> = ({
  topCollection,
  topDocId,
  mainCollection,
  mainDocId,
  collection,
  docId,
  collection2,
  docId2,
  appearance,
}) => {
  const [changeQualifications, setChangeQualifications] = useRecoilState(
    changeQualificationsState
  );
  const [changePreviews, setChangePreviews] =
    useRecoilState(changePreviewsState);
  const [fetchWorkHistory, setFetchWorkHistory] = useRecoilState(
    fetchWorkHistoryState
  );
  const setDeleteCategory = useSetRecoilState(deleteCategoryState);

  const delelteAction = async (mainDocId: string, docId: string) => {
    try {
      if (mainCollection === "familyCard") {
        if (collection === "detail") {
          const detailDocs = await getDocs(
            collectionRef(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              collection
            )
          );
          const academicHistoryDocs = await getDocs(
            collectionRef(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              "academicHistory"
            )
          );
          const qualificationDocs = await getDocs(
            collectionRef(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              "qualification"
            )
          );
          const workHistoryDocs = await getDocs(
            collectionRef(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              "workHistory"
            )
          );
          const deleteDetailPromises = detailDocs.docs.map((data) =>
            deleteDoc(data.ref)
          );
          const deleteAcademicPromises = academicHistoryDocs.docs.map((data) =>
            deleteDoc(data.ref)
          );
          const deleteQualificationPromises = qualificationDocs.docs.map(
            (data) => deleteDoc(data.ref)
          );
          const deleteWorkPromises = workHistoryDocs.docs.map((data) =>
            deleteDoc(data.ref)
          );
          await Promise.all(deleteDetailPromises);
          await Promise.all(deleteAcademicPromises);
          await Promise.all(deleteQualificationPromises);
          await Promise.all(deleteWorkPromises);
          const userDoc = await getDoc(
            doc(db, topCollection, topDocId, mainCollection, mainDocId)
          );
          await deleteDoc(userDoc.ref);
          window.location.reload();
        }
        if (collection === "qualification") {
          await deleteDoc(
            doc(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              collection,
              docId
            )
          );
          setChangeQualifications(!changeQualifications);
        }
        if (collection === "workHistory") {
          await deleteDoc(
            doc(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              collection,
              docId
            )
          );
          setFetchWorkHistory(!fetchWorkHistory);
        }
      }

      // NOTE：todosのTitleの削除処理
      if (mainCollection === "todos" && !collection2) {
        // titleのDeleteButtonが押された時、`title`配下の`todo`をすべて取得
        // todoに何かしら入っている状態でTitleを削除する際には、配下のtodoもすべて同時に削除する必要がある
        const todoCollectionRef = collectionRef(
          db,
          topCollection,
          topDocId,
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
        await deleteDoc(
          doc(
            db,
            topCollection,
            topDocId,
            mainCollection,
            mainDocId,
            collection,
            docId
          )
        );
        // TODO: TODOの削除にプレビューの取得？
        setChangePreviews(!changePreviews);
        // NOTE：todoの削除処理
      } else if (collection2 && docId2) {
        await deleteDoc(
          doc(
            db,
            topCollection,
            topDocId,
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
          const docRef = doc(
            db,
            topCollection,
            topDocId,
            mainCollection,
            mainDocId,
            collection,
            docId
          );
          await deleteDoc(docRef);
          // setAddCategory(!addCategory);
          setDeleteCategory(true);
        }
        if (collection === "previews") {
          await deleteDoc(
            doc(
              db,
              topCollection,
              topDocId,
              mainCollection,
              mainDocId,
              collection,
              docId
            )
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {appearance == "icon" && (
        <IconButton
          type="button"
          sx={{
            borderColor: "rgba(0,0,0,0.8)",
            "&:hover": {
              cursor: "pointer",
              background: "rgba(247,72,59,0.2)",
            },
          }}
          onClick={() => delelteAction(mainDocId, docId)}
        >
          <ClearIcon />
        </IconButton>
      )}
      {appearance == "string" && (
        <Button
          type="button"
          sx={{
            borderColor: "rgba(0,0,0,0.8)",
            "&:hover": {
              cursor: "pointer",
              background: "rgba(247,72,59,0.2)",
            },
          }}
          onClick={() => delelteAction(mainDocId, docId)}
        >
          削除
        </Button>
      )}
    </>
  );
};

export default DeleteButton;
