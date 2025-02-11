import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { changeQualificationsState } from "@/app/states/changeQualificationsState";
import { userIdState } from "@/app/states/userIdState";
import CreateIcon from "@mui/icons-material/Create";
import DeleteButton from "@/components/DeleteButton";
import { db } from "@/libs/firebase";
import { Grid, IconButton, Input, TextField, Typography } from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { qualificationDate } from "@/types/qualificationData";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type QualificationProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

// NOTE：familyCardの資格情報を処理・表示するためのコンポーネント
const Qualification: React.FC<QualificationProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState); // どのユーザーが選択されたか判別するためのステート
  const familyCardId = useRecoilValue(familyCardIdState);
  const changeEditDetail = useRecoilValue(changeEditDetailState); // 資格情報の編集モードへの切り替えに使うステート
  const changeQualifications = useRecoilValue(changeQualificationsState); // 資格情報の削除処理がかかったときに発火するステート
  const [qualification, setQualification] = useState<qualificationDate[]>([]); // 資格情報を格納するステート
  const [qualificationYear, setQualificationYear] = useState<string>(""); // 資格取得年月を格納するステート
  const [qualificationDetail, setQualificationDetail] = useState<string>(""); // 資格を格納するステート
  const [changeEditStart, setChangeEditStart] = useState<boolean>(false); // 資格の新規追加か編集かを切り替えるステート
  const [editingQualificationId, setEditingQualificationId] = useState<
    // どの資格情報が編集されているか判別するためのステート
    string | null
  >("");

  // NOTE：Firesoreから資格情報を取ってくる処理。
  const fetchQualificationDocs = async () => {
    if (!userId) return;
    const QualificationRef = query(
      collection(
        db,
        "familyCards",
        userId,
        "familyCard",
        familyCardId,
        "qualification"
      ),
      orderBy("year") // 年月が若い順に並べ替え
    );
    try {
      const qualificationRefSnapshot = await getDocs(QualificationRef);
      const qualificationRefs = qualificationRefSnapshot.docs.map((doc) => ({
        id: doc.id,
        year: doc.data().year,
        detail: doc.data().detail,
      }));
      setQualification(qualificationRefs);
    } catch (error) {
      console.error(error);
    }
  };

  // NOTE：userの切り替えがあったときと、資格情報が削除されたときにFiresoreから資格情報を取ってくる処理を発火
  useEffect(() => {
    fetchQualificationDocs();
  }, [userId, changeQualifications, familyCardId]);

  // NOTE：資格情報を追加する処理。
  const onAddQualification = async () => {
    if (userId && qualificationYear && qualificationDetail) {
      // 入力フォームに値が入力されていたら追加処理を走らせる
      const newQualificationRef = doc(
        collection(
          db,
          "familyCards",
          userId,
          "familyCard",
          familyCardId,
          "qualification"
        )
      );
      await setDoc(newQualificationRef, {
        year: qualificationYear,
        detail: qualificationDetail,
      });

      fetchQualificationDocs(); // データを保存した後に再取得
      setQualificationYear(""); // 入力フィールドをクリア
      setQualificationDetail(""); // 入力フィールドをクリア
    }
  };

  // NOTE：資格情報を編集したあと、更新する処理。Enterキーを押した際（handleKeyDown）、またはcreateButtonを押した際に発火。
  const onEditQualification = async () => {
    try {
      if (editingQualificationId && qualificationYear && qualificationDetail) {
        //特定の資格情報の入力フォームが開かれている時のみ処理を走らせる
        const qualificationRef = doc(
          db,
          "familyCards",
          userId,
          "familyCard",
          familyCardId,
          "qualification",
          editingQualificationId
        );
        await updateDoc(qualificationRef, {
          year: qualificationYear,
          detail: qualificationDetail,
        });
        fetchQualificationDocs(); // データを再取得
        setEditingQualificationId(null); // 編集モードを解除
        setQualificationYear(""); // フィールドをクリア
        setQualificationDetail(""); // フィールドをクリア
        setChangeEditStart(false); // 入力フォームの表示を終了
      }
    } catch (err) {
      console.log("error:", err);
    }
  };

  // NOTE：新規追加または編集の入力フォームで値を入力しEnterが押されたときに走る処理。
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  // NOTE:入力フォームのcreateButtonが押された時、Enterが押された時に走る処理。
  // 値の追加か更新かを、editingQualificationIdで判断し、処理を分けている。
  const handleSave = () => {
    if (editingQualificationId) {
      onEditQualification(); // 編集モード中なら編集を保存
    }
    if (!editingQualificationId && !changeEditDetail) {
      onAddQualification(); // 新規追加モードなら追加
    }
  };

  // NOTE：資格情報の編集を行おうとする時に、createButtonを押すと走る処理。
  // 編集したい資格情報が編集できるようになり、資格追加の入力フォームは一時見えなくなる。
  const editStart = (qualification: qualificationDate) => {
    setChangeEditStart(!changeEditStart); // 資格情報の入力フォームを開くと同時に、新規追加のフォームを一時閉じる
    setEditingQualificationId(qualification.id); // どの資格情報のcreateButtonが押されているかをステートに格納
    setQualificationYear(qualification.year); // 登録済みの資格情報を編集しやすいように入力フォームへ入れておく
    setQualificationDetail(qualification.detail); // 登録済みの資格情報を編集しやすいように入力フォームへ入れておく
  };

  // NOTE:userが切り替えられた場合と、資格情報の編集モードと追加モードとの切替時に発火。
  // 資格情報を編集するため格納した値が、新規追加の入力フォームに二重に表示されるバグを防いでいる。
  useEffect(() => {
    if (!changeEditStart) {
      setQualificationYear(""); // 入力フィールドをクリア
      setQualificationDetail(""); // 入力フィールドをクリア
    }
  }, [changeEditStart]);

  // NOTE:編集モードが終了し、新規の値が入力されていたときは、Firestoreに保存処理をかける
  useEffect(() => {
    if (!changeEditDetail && qualificationYear && qualificationDetail) {
      handleSave();
    }
  }, [changeEditDetail]);

  return (
    <Grid container sx={{ width: "100%" }}>
      {changeEditDetail && selectedIndex === detailIndex ? ( // changeEditDetailがtrueの場合は入力フォームを表示
        <Grid sx={{ width: "100%" }}>
          {qualification.map((item) => (
            <Grid key={item.id} sx={{ width: "100%" }}>
              <Grid container alignItems="center" sx={{ width: "100%" }}>
                {changeEditStart && editingQualificationId === item.id ? ( // 個別の資格情報の編集ボタン（createButton）が押されたとき、その資格情報の入力フォームを表示
                  <Grid item sx={{ width: "80%" }}>
                    <Grid container sx={{ width: "100%" }}>
                      <Grid item sx={{ width: "30%", marginRight: "5px" }}>
                        <TextField
                          value={qualificationYear}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQualificationYear(e.target.value)
                          }
                          inputProps={{
                            type: "month", // 年月のみを入力するフォーム
                            onKeyDown: handleKeyDown, // エンターキーのイベントを追加
                          }}
                          variant="outlined"
                          sx={{
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item sx={{ width: "65%", marginRight: "5px" }}>
                        <TextField
                          value={qualificationDetail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setQualificationDetail(e.target.value)
                          }
                          inputProps={{
                            onKeyDown: handleKeyDown, // エンターキーのイベントを追加
                          }}
                          variant="outlined"
                          sx={{
                            width: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ) : (
                  // 編集モード終了したら資格情報をテキストで表示
                  <Grid item sx={{ width: "80%" }}>
                    <Grid container>
                      <Grid item sx={{ marginRight: "10px" }}>
                        <Typography>{item.year}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography>{item.detail}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                <Grid item sx={{ width: "10%" }}>
                  <IconButton
                    type="button"
                    sx={{
                      borderColor: "rgba(0,0,0,0.8)",
                      "&:active": {
                        cursor: "pointer",
                        background: "rgba(247,72,59,0.2)",
                      },
                    }}
                    onClick={() => {
                      if (
                        // 最初の状態からCreateIconをクリックすると、入力フォームを開く（editStart(item)）の処理が走り、編集モードを終了する際にCreateIconをクリックしたら、入力データ保存（handleSave()）の処理が走る。
                        changeEditStart &&
                        editingQualificationId === item.id
                      ) {
                        handleSave();
                      } else {
                        editStart(item);
                      }
                    }}
                  >
                    <CreateIcon />
                  </IconButton>
                </Grid>
                <Grid item sx={{ width: "10%" }}>
                  <DeleteButton
                    topCollection="familyCards"
                    topDocId={userId}
                    mainCollection="familyCard"
                    mainDocId={familyCardId}
                    collection="qualification"
                    docId={item.id}
                    appearance={"icon"}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
          {changeEditStart ? ( // 個々の資格情報を編集中のときには、新規追加する入力フォームは非表示にする処理
            ""
          ) : (
            <Grid container sx={{ width: "100%" }}>
              <Grid item sx={{ width: "20%", marginRight: "10px" }}>
                <TextField
                  placeholder="資格の年月"
                  value={qualificationYear}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQualificationYear(e.target.value)
                  }
                  inputProps={{
                    type: "month", // 年月のみを入力するフォーム
                    onKeyDown: handleKeyDown, // エンターキーのイベントを追加
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                />
              </Grid>

              <Grid item sx={{ width: "75%" }}>
                <TextField
                  placeholder="資格の詳細"
                  value={qualificationDetail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQualificationDetail(e.target.value)
                  }
                  inputProps={{
                    onKeyDown: handleKeyDown, // エンターキーのイベントを追加
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.1)",
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        // 大元の編集モードが終了した時にテキストのみを表示している
        qualification.map((item) => (
          <Grid key={item.id} sx={{ width: "100%" }}>
            <Grid container justifyContent="center" sx={{ width: "100%" }}>
              <Grid item xs={3} sx={{ marginRight: "10px" }}>
                <Typography textAlign="center">{item.year}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography textAlign="left">{item.detail}</Typography>
              </Grid>
            </Grid>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Qualification;
