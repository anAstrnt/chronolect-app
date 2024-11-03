"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
      const academicHistoryRef = doc(
        db,
        "familyCard",
        userId,
        "detail",
        "academicHistory"
      );
      const academicHistoryDoc = await getDoc(academicHistoryRef);
      if (academicHistoryDoc.exists()) {
        const data = academicHistoryDoc.data();
        setAcademicHistoryItems(data.history);
        setFetchHistoryItems(data.history); // 初期データとして保持
        setPreviousBirthday(data.birthday);
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
      const academicHistoryRef = doc(
        db,
        "familyCard",
        userId,
        "detail",
        "academicHistory"
      );
      await setDoc(academicHistoryRef, {
        history: calcHistoryDates,
        birthday: { birthday },
      });
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
  const onSaveHistoryToFirebase = async () => {
    if (
      JSON.stringify(fetchHistoryItems) !== JSON.stringify(academicHistoryItems)
    ) {
      try {
        const academicHistoryRef = doc(
          db,
          "familyCard",
          userId,
          "detail",
          "academicHistory"
        );
        await updateDoc(academicHistoryRef, {
          history: academicHistoryItems,
          birthday: { birthday },
        });
        setFetchHistoryItems(academicHistoryItems); // 最新データを初期データとして更新
      } catch (error) {
        console.error("Error updating academic history:", error);
      }
    }
    setChangeEditDetail(false);
  };

  // 編集モードが解除されたときにデータを保存
  useEffect(() => {
    if (!changeEditDetail) {
      onSaveHistoryToFirebase();
    }
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
        academicHistoryItems.map((item, index) => (
          <Grid item key={index} sx={{ width: "100%" }}>
            <Grid
              container
              justifyContent="space-around"
              sx={{ width: "100%" }}
            >
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
                <Grid item xs={8} sx={{ marginRight: "10px" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"text"}
                      inputValue={item.contentStart}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && onSaveHistoryToFirebase()
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(index, "contentStart", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentStart}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentStartDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && onSaveHistoryToFirebase()
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
                <Grid item xs={8} sx={{ marginRight: "10px" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"text"}
                      inputValue={item.contentEnd}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && onSaveHistoryToFirebase()
                      }
                      onChangeAcademicValue={(e) =>
                        handleInputChange(index, "contentEnd", e.target.value)
                      }
                    />
                  ) : (
                    <Typography sx={{ textAlign: "center" }}>
                      {item.contentEnd}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={4}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <InputFormComp
                      type={"month"}
                      inputValue={item.contentEndDate}
                      handleKeyDown={(e) =>
                        e.key === "Enter" && onSaveHistoryToFirebase()
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
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default AcademicHistory;
