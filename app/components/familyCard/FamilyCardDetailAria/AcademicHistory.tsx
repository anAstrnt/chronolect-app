"use client";

import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/libs/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import { userIdState } from "@/app/states/userIdState";
import { Grid, Typography } from "@mui/material";
import { changeEditDetailState } from "@/app/states/changeEditDetailState";
import { birthdayState } from "@/app/states/birthdayState";
import { calcSchoolDates } from "@/components/calcSchoolDates";
import { academicHistoryItemsState } from "@/app/states/academicHistoryItemsState";
import { academicHistoryItemsTypes } from "@/types/academicHistoryItemTypes";
import InputFormComp from "@/components/InputFormComp";

type AcademicHistoryProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

type PreviousBirthdayType = {
  birthday: string;
};

const AcademicHistory: React.FC<AcademicHistoryProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  );
  const birthday = useRecoilValue(birthdayState);
  const [academicHistoryItems, setAcademicHistoryItems] = useRecoilState(
    academicHistoryItemsState
  );
  // Firestoreから取得した初期のデータを保持
  const [fetchHistoryItems, setFetchHistoryItems] = useState<
    academicHistoryItemsTypes[]
  >([]);
  const [previousBirthday, setPreviousBirthday] =
    useState<PreviousBirthdayType>();

  // 初期データをFirestoreから取得
  useEffect(() => {
    if (userId) {
      fetchAcademicHistoryFromFirebase();
    }
  }, [userId]);

  const fetchAcademicHistoryFromFirebase = async () => {
    try {
      const academicHistoryRef = collection(
        db,
        "familyCard",
        userId,
        "academicHistory"
      );
      const birthdayRef = doc(academicHistoryRef, "birthday");
      const academicHistoryDoc = await getDocs(academicHistoryRef);
      const birthdayDoc = await getDoc(birthdayRef);
      if (academicHistoryDoc) {
        const historyData = academicHistoryDoc.docs
          .filter((doc) => doc.id !== "birthday")
          .map((doc) => ({
            id: doc.id,
            school: doc.data().school,
            contentStartDate: doc.data().contentStartDate,
            contentEndDate: doc.data().contentEndDate,
          }));
        if (birthdayDoc.exists()) {
          const birthdayData = {
            birthday: birthdayDoc.data().birthday,
          };
          setPreviousBirthday(birthdayData);
        }

        historyData.sort((a, b) => {
          const dateA = new Date(a.contentStartDate).getTime();
          const dateB = new Date(b.contentStartDate).getTime();
          return dateA - dateB;
        });

        setAcademicHistoryItems(historyData);
        setFetchHistoryItems(historyData); // 初期データとして保持
      } else {
        setPreviousBirthday({ birthday: "" });
      }
    } catch (error) {
      console.error("Error fetching academic history: ", error);
    }
  };

  // 誕生日が更新されたときに学歴を自動計算し、Firestoreに保存
  useEffect(() => {
    if (birthday && birthday !== previousBirthday?.birthday) {
      const schoolDates = calcSchoolDates(birthday);
      setAcademicHistoryItems(schoolDates);
      saveAcademicHistoryToFirebase(schoolDates);
    } else if (!birthday) {
      setAcademicHistoryItems([]);
    }
  }, [birthday]);

  const saveAcademicHistoryToFirebase = async (
    calcHistoryDates: academicHistoryItemsTypes[]
  ) => {
    try {
      const academicHistoryRef = collection(
        db,
        "familyCard",
        userId,
        "academicHistory"
      );
      const academicHistorySnapshot = await getDocs(academicHistoryRef);
      const deleteAcademicPromises = academicHistorySnapshot.docs.map(
        (doc) => deleteDoc(doc.ref) // todoDoc.ref=todoDocのドキュメント参照。ドキュメントの削除や更新ができる。
      );
      await Promise.all(deleteAcademicPromises);
      calcHistoryDates.map(async (date) => {
        await addDoc(academicHistoryRef, date);
      });

      const birthdayRef = doc(academicHistoryRef, "birthday");
      if (birthday) {
        await setDoc(birthdayRef, { birthday: birthday });
      }
      fetchAcademicHistoryFromFirebase();
    } catch (error) {
      console.error("Error saving academic history:", error);
    }
  };

  // 入力変更時のステート更新
  const handleInputChange = (
    index: number,
    key: keyof academicHistoryItemsTypes,
    value: string
  ) => {
    const updatedHistory = academicHistoryItems.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setAcademicHistoryItems(updatedHistory);
  };

  // Firestoreデータの保存処理
  const handleSaveToFirebase = async (item: academicHistoryItemsTypes) => {
    if (
      JSON.stringify(fetchHistoryItems) !== JSON.stringify(academicHistoryItems)
    ) {
      try {
        if (item.id) {
          const academicHistoryRef = doc(
            db,
            "familyCard",
            userId,
            "academicHistory",
            item.id
          );
          await updateDoc(academicHistoryRef, {
            school: item.school,
            contentStartDate: item.contentStartDate,
            contentEndDate: item.contentEndDate,
          });
          setFetchHistoryItems(academicHistoryItems); // 最新データを初期データとして更新
        } else {
        }
      } catch (error) {
        console.error("Error updating academic history:", error);
      }
    }
    setChangeEditDetail(false);
  };

  const allSaveToFirebase = async () => {
    if (!userId) return;

    academicHistoryItems.map(async (item) => {
      if (item.id) {
        const academicHistoryRef = doc(
          db,
          "familyCard",
          userId,
          "academicHistory",
          item.id
        );
        await updateDoc(academicHistoryRef, {
          school: item.school,
          contentStartDate: item.contentStartDate,
          contentEndDate: item.contentEndDate,
        });
      }
    });
  };

  useEffect(() => {
    allSaveToFirebase();
  }, [changeEditDetail]);

  return (
    <Grid
      container
      sx={{ margin: "20px 0 20px 0", justifyContent: "center", width: "100%" }}
    >
      {!previousBirthday?.birthday ? (
        <Grid item xs={12} justifyContent="center">
          <Typography textAlign="center">
            誕生日を入力すれば、自動で学歴が表示されます。
          </Typography>
        </Grid>
      ) : (
        <Grid item sx={{ width: "100%" }}>
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
              <Typography textAlign="center">学校名</Typography>
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
                <Typography textAlign="center">入学</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  backgroundColor: "rgba(224,224,224,0.25)",
                  borderRadius: "10px",
                }}
              >
                <Typography textAlign="center">卒業</Typography>
              </Grid>
            </Grid>
          </Grid>
          {academicHistoryItems.map((item, index) => (
            <Grid
              key={index}
              item
              container
              justifyContent="space-around"
              sx={{ width: "100%" }}
            >
              <Grid item xs={12} sx={{ width: "100%", marginRight: "10px" }}>
                {changeEditDetail && selectedIndex === detailIndex ? (
                  <InputFormComp
                    type={"text"}
                    inputValue={item.school}
                    handleKeyDown={(e) =>
                      e.key === "Enter" && handleSaveToFirebase(item)
                    }
                    onChangeAcademicValue={(e) =>
                      handleInputChange(index, "school", e.target.value)
                    }
                  />
                ) : (
                  <Typography sx={{ textAlign: "center" }}>
                    {item.school}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentStartDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && handleSaveToFirebase(item)
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentStartDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentStartDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid
                item
                xs={1}
                sx={{
                  width: "100%",
                  display: "flex",
                  margin: "10px 0",
                }}
              >
                <Typography sx={{ width: "100%", textAlign: "center" }}>
                  ー
                </Typography>
              </Grid>
              <Grid
                item
                xs={5.5}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  margin: "10px 0",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentEndDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && handleSaveToFirebase(item)
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentEndDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentEndDate}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default AcademicHistory;
