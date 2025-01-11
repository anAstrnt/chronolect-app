import React, { useEffect, useState } from "react";
import { Grid, Input, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { workHistoryItemsState } from "@/app/states/workHistoryItemsState";
import InputFormComp from "@/components/InputFormComp";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { workHistoryItemsTypes } from "@/types/workHistoryItemTypes";
import DeleteButton from "@/components/DeleteButton";
import { fetchWorkHistoryState } from "@/app/states/fetchWorkHistoryState";
import { familyCardIdState } from "@/app/states/familyCardIdState";

type workHistoryProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

const WorkHistory: React.FC<workHistoryProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState); // 選択されたUserのIdを取ってくるステート
  const familyCardId = useRecoilValue(familyCardIdState);
  const fetchWorkHistory = useRecoilValue(fetchWorkHistoryState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  ); // 編集モードを切り替えをするステート
  const [workHistoryItems, setWorkHistoryItems] = useRecoilState(
    workHistoryItemsState
  ); // 現在の職歴データを保持するためのステート。この状態は、Userが職歴を編集したり、新しい職歴を追加したりする際に変更される。
  const [company, setCompany] = useState<string>("");
  const [employmentDate, setEmploymentDate] = useState<string>("");
  const [resignationDate, setResignationDate] = useState<string>("");

  // Firestoreからデータ取得する処理
  const fetchWorkHistoryFromFirebase = async () => {
    try {
      const workHistoryCollectionRef = collection(
        db,
        "familyCards",
        userId,
        "familyCard",
        familyCardId,
        "workHistory"
      );

      const querySnapshot = await getDocs(workHistoryCollectionRef);

      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        company: doc.data().company || "", // 必要なプロパティを追加
        employmentDate: doc.data().employmentDate || "", // 必要なプロパティを追加
        resignationDate: doc.data().resignationDate || "", // 必要なプロパティを追加
      }));

      // employmentDateでソート（古い順）
      historyData.sort((a, b) => {
        const dateA = new Date(a.employmentDate).getTime();
        const dateB = new Date(b.employmentDate).getTime();
        return dateA - dateB;
      });

      setWorkHistoryItems(historyData);
    } catch (error) {
      console.error("Error fetching work history: ", error);
      setWorkHistoryItems([]);
    }
  };

  // userを切り替えたらFirestoreからデータ取得
  useEffect(() => {
    if (userId && familyCardId) {
      fetchWorkHistoryFromFirebase();
    }
  }, [userId, familyCardId]);

  // 編集フォームへ入力された値を表示、workHistoryItemsへ格納する。
  const handleInputChange = (
    index: number,
    key: keyof workHistoryItemsTypes,
    value: string
  ) => {
    const updatedHistory = workHistoryItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setWorkHistoryItems(updatedHistory);
  };

  // Firestoreへ新規または編集済みのデータを保存
  const saveToFirestore = async () => {
    try {
      const workHistoryCollectionRef = collection(
        db,
        "familyCards",
        userId,
        "familyCard",
        familyCardId,
        "workHistory"
      );

      // 既存のデータを更新する場合
      await Promise.all(
        workHistoryItems.map(async (item) => {
          if (item.id) {
            // 既存のデータを更新
            const docRef = doc(workHistoryCollectionRef, item.id);
            await setDoc(docRef, {
              company: item.company,
              employmentDate: item.employmentDate,
              resignationDate: item.resignationDate,
            });
          }
        })
      );

      // 新規のデータ登録をする場合
      if (workHistoryItems.length === 0) {
        // Enterで保存しようとした場合
        if (workHistoryItems[0]) {
          await addDoc(workHistoryCollectionRef, workHistoryItems[0]);
        }
        // 追加ボタンで保存しようとした場合
        if (company || employmentDate || resignationDate) {
          const newEntry = {
            company: company || "",
            employmentDate: employmentDate || "",
            resignationDate: resignationDate || "",
          };
          await addDoc(workHistoryCollectionRef, newEntry);
          setCompany("");
          setEmploymentDate("");
          setResignationDate("");
          fetchWorkHistoryFromFirebase();
          return;
        }
      }

      // すでにデータが有る状態で、新しいデータを追加する場合(Enterで保存しようとした場合)
      if (workHistoryItems.length > 0) {
        const lastItem = workHistoryItems[workHistoryItems.length - 1];
        if (!lastItem.id) {
          await addDoc(workHistoryCollectionRef, lastItem);
        }
      }

      // すでにデータが有る状態で、新しいデータを追加する場合(追加ボタンで保存しようとした場合)
      if (company || employmentDate || resignationDate) {
        const newEntry = {
          company: company || "",
          employmentDate: employmentDate || "",
          resignationDate: resignationDate || "",
        };
        await addDoc(workHistoryCollectionRef, newEntry);
      }

      setCompany("");
      setEmploymentDate("");
      setResignationDate("");
      fetchWorkHistoryFromFirebase(); // 最新データ取得
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  // 編集モード解除時に、Firestoreへの保存処理かける。
  useEffect(() => {
    const lastItem = workHistoryItems[workHistoryItems.length - 1];
    if (!lastItem?.id || company || employmentDate || resignationDate) {
      saveToFirestore();
    }
  }, [changeEditDetail]);

  // 値の編集フォームや新規入力フォームで編集したあとEnterキーを押した際、新しい値でworkHistoryItemsを更新する処理
  const addNewHistoryEntry = () => {
    if (!company && !employmentDate && !resignationDate) return; // 新規フォームが全てからの場合は更新しない

    const newEntry = {
      company,
      employmentDate,
      resignationDate,
    };

    const updatedHistory = [...workHistoryItems, newEntry]; // 新しい値のworkHistoryItemsを構成
    setWorkHistoryItems(updatedHistory); // 新しい値でworkHistoryItemsを更新
    setCompany(""); // 新規入力フォームの入力値リセット
    setEmploymentDate(""); // 新規入力フォームの入力値リセット
    setResignationDate(""); // 新規入力フォームの入力値リセット
    setChangeEditDetail(false); // 編集フォームの解除
  };

  useEffect(() => {
    fetchWorkHistoryFromFirebase();
  }, [fetchWorkHistory]);

  return (
    <Grid container sx={{ margin: "20px 0" }}>
      <Grid container sx={{ width: "100%" }}>
        <Grid
          item
          sx={{
            width: "100%",
            backgroundColor: "rgba(224,224,224,0.25)",
            borderRadius: "10px",
            marginBottom: "5px",
          }}
        >
          <Typography textAlign="center">会社名</Typography>
        </Grid>
        <Grid item container sx={{ width: "100%" }}>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "rgba(224,224,224,0.25)",
              borderRadius: "10px",
            }}
          >
            <Typography textAlign="center">入職日</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              backgroundColor: "rgba(224,224,224,0.25)",
              borderRadius: "10px",
            }}
          >
            <Typography textAlign="center">退職日</Typography>
          </Grid>
        </Grid>
      </Grid>
      {workHistoryItems.map((item, index) => (
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          key={index}
          sx={{ width: "100%" }}
        >
          <Grid
            item
            container
            flexDirection="column"
            xs={11}
            sx={{ width: "100%" }}
          >
            <Grid item justifyContent="center">
              {changeEditDetail && selectedIndex === detailIndex ? (
                <InputFormComp
                  type={"text"}
                  inputValue={item.company}
                  handleKeyDown={(e) =>
                    e.key === "Enter" && addNewHistoryEntry()
                  }
                  onChangeAcademicValue={(e) =>
                    handleInputChange(index, "company", e.target.value)
                  }
                />
              ) : (
                <Typography sx={{ textAlign: "center" }}>
                  {item.company}
                </Typography>
              )}
            </Grid>
            <Grid item container>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0 20px 0",
                }}
              >
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"month"}
                    inputValue={item.employmentDate}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && addNewHistoryEntry()
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(index, "employmentDate", e.target.value)
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.employmentDate}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                <Typography sx={{ textAlign: "center" }}>ー</Typography>
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  width: "200px",
                  margin: "10px 0 20px 0",
                }}
              >
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"month"}
                    inputValue={item.resignationDate || ""}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && addNewHistoryEntry()
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(
                        index,
                        "resignationDate",
                        e.target.value
                      )
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.resignationDate}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>

          {changeEditDetail && selectedIndex === detailIndex ? (
            <Grid item xs={1} sx={{ width: "100%" }}>
              <DeleteButton
                topCollection="familyCards"
                topDocId={userId}
                mainCollection="familyCard"
                mainDocId={familyCardId}
                collection="workHistory"
                docId={item.id || ""}
                appearance={"icon"}
              />
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      ))}

      {/* Form for adding new history entry */}
      {changeEditDetail && selectedIndex === detailIndex && (
        <Grid container justifyContent="space-around">
          <Grid item sx={{ width: "100%" }}>
            <Input
              type="text"
              value={company}
              onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
              onChange={(e) => setCompany(e.target.value)}
              disableUnderline
              sx={{
                width: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
              }}
            />
          </Grid>
          <Grid container>
            <Grid
              item
              xs={5.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                margin: "10px 0",
              }}
            >
              <Grid item sx={{ marginBottom: "10px" }}>
                <Input
                  type="month"
                  value={employmentDate}
                  onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
                  onChange={(e) => setEmploymentDate(e.target.value)}
                  disableUnderline
                  sx={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px 0",
              }}
            >
              <Typography>ー</Typography>
            </Grid>
            <Grid
              item
              xs={5.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "200px",
                margin: "10px 0 20px 0",
              }}
            >
              <Input
                type="month"
                value={resignationDate}
                onKeyDown={(e) => e.key === "Enter" && addNewHistoryEntry()}
                onChange={(e) => setResignationDate(e.target.value)}
                disableUnderline
                sx={{
                  width: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default WorkHistory;
