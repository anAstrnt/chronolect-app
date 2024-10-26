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
import AcademicInputComp from "@/components/AcademicInputComp";

type AcademicHistoryProps = {
  selectedIndex: number | undefined;
  detailIndex: number;
};

type previousBirethdayType = {
  birthday: string;
};

const AcademicHistory: React.FC<AcademicHistoryProps> = ({
  selectedIndex,
  detailIndex,
}) => {
  const userId = useRecoilValue(userIdState);
  const [changeEditDetail, setChangeEditDetail] = useRecoilState(
    changeEditDetailState
  ); // 値をテキストから編集に切り替えるためのステート
  const birthday = useRecoilValue(birthdayState);
  const [academicHistoryItems, setAcademicHistoryItems] = useRecoilState(
    academicHistoryItemsState
  );

  const [previousBirthday, setPreviousBirthday] =
    useState<previousBirethdayType>();

  // ユーザーが選択されたらFirestoreからデータを取ってくる処理を実行
  useEffect(() => {
    if (userId) {
      fetchAcademicHistoryFromFirebase();
    }
  }, [userId, birthday]);

  // Firebaseから学歴データを取得する処理
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
        // データを取得できた場合
        const data = academicHistoryDoc.data();
        await setAcademicHistoryItems(data.history);
        await setPreviousBirthday(data.birthday);
      } else {
        // データがない場合
        console.log("Not fetching Date");
        setPreviousBirthday({ birthday: "" });
      }
    } catch (error) {
      console.error("Error fetching academic history: ", error);
    }
  };

  // 誕生日が新規登録された時・誕生日が更新された時に学歴を自動計算する処理。
  // リダイレクトしたときや手動計算したときに処理が走らないように、birthday !== previousBirthday?.birthdayをつけています。
  useEffect(() => {
    if (birthday && birthday !== previousBirthday?.birthday) {
      const schoolDates = calcSchoolDates(birthday);
      setAcademicHistoryItems(schoolDates);
      saveAcademicHistoryToFirebase(schoolDates);
    } else if (!birthday) {
      setAcademicHistoryItems([]);
    }
    return;
  }, [birthday]);

  // 誕生日から学歴を自動計算したときに、その値をFirestoreに登録する処理
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
        birthday: { birthday: birthday },
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  // 学歴を手動編集する時に、フォームに入力した文字をステートに格納しつつ表示させる処理
  const handleInputChange = (
    index: number,
    key: keyof academicHistoryItemsTypes,
    value: string
  ) => {
    console.log("ind");
    const updateHistory = academicHistoryItems.map((item, i) => {
      if (i === index) {
        return { ...item, [key]: value };
      }
      return item;
    });
    setAcademicHistoryItems(updateHistory);
    // const updateHistory = [...academicHistoryItems];
    // updateHistory[index][key] = value;
    // setAcademicHistoryItems(updateHistory);
  };

  // 手動編集後にエンターキーを押したらFirestoreへの保存処理がかかる
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };
  const handleSave = async () => {
    if (changeEditDetail) {
      await onSaveHistoryToFirebase();
    }
  };

  // Firestoreのデータを更新する処理
  const onSaveHistoryToFirebase = async () => {
    const academicHistoryRef = doc(
      db,
      "familyCard",
      userId,
      "detail",
      "academicHistory"
    );
    try {
      await updateDoc(academicHistoryRef, {
        history: academicHistoryItems,
        birthday: { birthday: birthday },
      });
      setChangeEditDetail(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <Grid container sx={{ margin: "20px 0 20px 0" }}>
      {/* 誕生日が未入力のときは、メッセージ表示。入力があるときは学歴リスト表示 */}
      {!previousBirthday?.birthday ? (
        <Grid item xs={12} justifyContent="center">
          <Typography>
            誕生日を入力すれば、自動で学歴が表示されます。
          </Typography>
        </Grid>
      ) : (
        academicHistoryItems.map((item, index) => (
          <Grid key={index}>
            <Grid container justifyContent="space-around">
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  margin: "10px 0 10px 0",
                }}
              >
                <Grid item sx={{ marginRight: "10px" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <AcademicInputComp
                      inputValue={item.contentStart}
                      handleKeyDown={handleKeyDown}
                      onChangeAcademicValue={(e) =>
                        handleInputChange(index, "contentStart", e.target.value)
                      }
                    />
                  ) : (
                    <Typography>{item.contentStart}</Typography>
                  )}
                </Grid>
                <Grid item>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <AcademicInputComp
                      inputValue={item.contentStartDate}
                      handleKeyDown={handleKeyDown}
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentStartDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography>{item.contentStartDate}</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item sx={{ display: "flex", margin: "10px 0 10px 0" }}>
                <Typography>ー</Typography>
              </Grid>
              <Grid
                item
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  margin: "10px 0 10px 0",
                }}
              >
                <Grid item sx={{ marginRight: "10px" }}>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <AcademicInputComp
                      inputValue={item.contentEnd}
                      handleKeyDown={handleKeyDown}
                      onChangeAcademicValue={(e) =>
                        handleInputChange(index, "contentEnd", e.target.value)
                      }
                    />
                  ) : (
                    <Typography>{item.contentEnd}</Typography>
                  )}
                </Grid>
                <Grid item>
                  {changeEditDetail && selectedIndex === detailIndex ? (
                    <AcademicInputComp
                      inputValue={item.contentEndDate}
                      handleKeyDown={handleKeyDown}
                      onChangeAcademicValue={(e) =>
                        handleInputChange(
                          index,
                          "contentEndDate",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    <Typography>{item.contentEndDate}</Typography>
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
